/**
 * zatca_phase2.js — ZATCA (Fatoora) Phase-2 cryptographic core + Fatoora API client (GATE-INT: ZATCA).
 *
 * Phase-1 artifacts (UBL 2.1 XML, TLV QR tags 1-5, document SHA-256) already live in ./finance_engine.
 * This module adds everything Phase-2 needs UP TO the credentialed network call, so the system becomes
 * "CSID-ready" — the org plugs in its ZATCA-issued certificate (CSID) and private key and it goes live.
 *
 * Built WITHOUT any ZATCA credential (Node stdlib `crypto` only, no external deps):
 *   - secp256k1 EC key generation (the keypair the org owns; its public part is certified by ZATCA).
 *   - invoiceHash(canonicalXml)  -> base64 SHA-256 (Phase-2 QR tag 6 + the PIH chain value).
 *   - signHashECDSA(hashB64, privPem) -> base64 ECDSA signature (QR tag 7).
 *   - buildPhase2QR(fields) -> base64 of TLV tags 1..9 (5 Phase-1 + hash/signature/publicKey/caStamp).
 *   - PIH chaining helpers (each invoice carries the previous invoice's hash -> tamper-evident chain).
 *   - generateCsrConfig(...) -> the exact ZATCA openssl CSR config (CSR creation uses openssl, since
 *     PKCS#10 with ZATCA's custom SAN cannot be produced by Node stdlib alone).
 *   - FatooraClient: compliance / production-CSID / clearance(standard) / reporting(simplified) calls,
 *     GATED — it refuses to transmit unless a real CSID + base URL are configured.
 *
 * CREDENTIAL BOUNDARY (cannot be done without the org): the compliance/production CSID is issued by
 * ZATCA after submitting the CSR with a one-time OTP from the taxpayer's Fatoora portal. Everything in
 * this file works before that; only FatooraClient.* actually transmits, and only once configured.
 */
'use strict';
const crypto = require('crypto');

// ---- TLV (tag-length-value), bytes, ZATCA QR ---------------------------------------------------
// length is a single byte per ZATCA spec (values are short); value is UTF-8 (or raw bytes for crypto tags).
function tlv(tag, value) {
    const v = Buffer.isBuffer(value) ? value : Buffer.from(String(value == null ? '' : value), 'utf8');
    return Buffer.concat([Buffer.from([tag & 0xff]), Buffer.from([v.length & 0xff]), v]);
}

// ---- EC keypair (secp256k1) --------------------------------------------------------------------
// Returns PEM strings. The PUBLIC key (DER, base64) becomes QR tag 8; the PRIVATE key signs (tag 7).
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKeyPem: publicKey, privateKeyPem: privateKey };
}

// raw DER bytes of an SPKI public key PEM (ZATCA QR tag 8 carries the DER public key)
function publicKeyDer(publicKeyPem) {
    return crypto.createPublicKey(publicKeyPem).export({ type: 'spki', format: 'der' });
}

// ---- hashing + PIH chain -----------------------------------------------------------------------
// invoiceHash: base64( SHA-256( canonical invoice XML ) ). Caller supplies already-canonicalized XML
// (Phase-2 mandates C14N over the UBL; finance_engine.buildUBLInvoice emits deterministic XML).
function invoiceHash(canonicalXml) {
    return crypto.createHash('sha256').update(Buffer.from(canonicalXml, 'utf8')).digest('base64');
}

// PIH for the very first invoice in a chain is the base64 of SHA-256("0") per ZATCA spec.
const GENESIS_PIH = crypto.createHash('sha256').update(Buffer.from('0', 'utf8')).digest('base64');
function nextPih(previousInvoiceHashB64) {
    return previousInvoiceHashB64 && previousInvoiceHashB64.length ? previousInvoiceHashB64 : GENESIS_PIH;
}

// ---- ECDSA signing / verification --------------------------------------------------------------
// Signs the raw SHA-256 *digest bytes* of the invoice (ZATCA signs the invoice hash). Returns base64.
function signHashECDSA(invoiceHashB64, privateKeyPem) {
    const digest = Buffer.from(invoiceHashB64, 'base64');               // 32-byte SHA-256 digest
    const sign = crypto.createSign('SHA256');                          // sign the digest representation
    sign.update(digest); sign.end();
    return sign.sign(privateKeyPem).toString('base64');               // DER ECDSA signature, base64
}
function verifyHashECDSA(invoiceHashB64, signatureB64, publicKeyPem) {
    const digest = Buffer.from(invoiceHashB64, 'base64');
    const verify = crypto.createVerify('SHA256');
    verify.update(digest); verify.end();
    return verify.verify(publicKeyPem, Buffer.from(signatureB64, 'base64'));
}

// ---- Phase-2 QR (9 TLV tags, base64) -----------------------------------------------------------
// fields: { sellerName, sellerVat, timestamp, total, vat, invoiceHashB64, signatureB64,
//           publicKeyDerBuf, caSignatureB64? }  (tag 9 CA signature optional for simplified invoices)
function buildPhase2QR(f) {
    const tags = [
        tlv(1, f.sellerName || ''),
        tlv(2, f.sellerVat || ''),
        tlv(3, f.timestamp || ''),
        tlv(4, f.total == null ? '0.00' : String(f.total)),
        tlv(5, f.vat == null ? '0.00' : String(f.vat)),
        tlv(6, f.invoiceHashB64 || ''),
        tlv(7, f.signatureB64 || ''),
        tlv(8, Buffer.isBuffer(f.publicKeyDerBuf) ? f.publicKeyDerBuf : Buffer.from(f.publicKeyDerBuf || '', 'utf8'))
    ];
    if (f.caSignatureB64) tags.push(tlv(9, Buffer.from(f.caSignatureB64, 'base64')));
    return Buffer.concat(tags).toString('base64');
}

// decode a base64 ZATCA QR back into { tag: value(Buffer) } — used by tests + diagnostics.
function decodeQR(b64) {
    const buf = Buffer.from(b64, 'base64');
    const out = {};
    let i = 0;
    while (i + 2 <= buf.length) {
        const tag = buf[i], len = buf[i + 1];
        out[tag] = buf.subarray(i + 2, i + 2 + len);
        i += 2 + len;
    }
    return out;
}

// ---- CSR config (openssl drives the actual PKCS#10 with ZATCA's custom SAN) ---------------------
// ZATCA requires a CSR whose subjectAltName/dirName carries the EGS unit identity. Node stdlib can't
// emit that, so we generate the canonical openssl config + the two commands the operator runs.
function generateCsrConfig({
    commonName, serialNumber, organizationIdentifier, organizationUnitName,
    organizationName, countryName = 'SA', invoiceType = '1100',
    location = '', industry = 'Medical', environment = 'sandbox'
} = {}) {
    // template.asn1 oid for ZATCA: 1.3.6.1.4.1.311.20.2 (Microsoft certificateTemplateName) per spec.
    const titleByEnv = { sandbox: 'TSTZATCA-Code-Signing', simulation: 'PREZATCA-Code-Signing', production: 'ZATCA-Code-Signing' };
    const config = [
        '[req]', 'default_bits = 2048', 'emailAddress = ', 'req_extensions = v3_req',
        'x509_extensions = v3_req', 'prompt = no', 'distinguished_name = dn', '',
        '[dn]', `CN = ${commonName || 'EGS-Unit'}`, '', '[v3_req]',
        `1.3.6.1.4.1.311.20.2 = ASN1:UTF8String:${titleByEnv[environment] || titleByEnv.sandbox}`,
        'subjectAltName = dirName:alt_names', '', '[alt_names]',
        `SN = ${serialNumber || ''}`,                 // EGS serial (1-Software|2-Model|3-SerialNo)
        `UID = ${organizationIdentifier || ''}`,      // VAT / org identifier
        `title = ${invoiceType}`,                     // 1100 = standard+simplified
        `registeredAddress = ${location}`,
        `businessCategory = ${industry}`,
        `OU = ${organizationUnitName || ''}`,
        `O = ${organizationName || ''}`,
        `C = ${countryName}`
    ].join('\n');
    const commands = [
        'openssl ecparam -name secp256k1 -genkey -noout -out ec-private.pem',
        'openssl req -new -sha256 -key ec-private.pem -extensions v3_req -config csr.cnf -out generated.csr',
        '# then base64 the CSR and POST it to the compliance endpoint with the portal OTP'
    ];
    return { config, commands };
}

// ---- Fatoora API client (GATED — never transmits without a configured CSID + base URL) ----------
const FATOORA_BASE = {
    sandbox:    'https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal',
    simulation: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation',
    production: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/core'
};
class FatooraClient {
    constructor({ environment = 'sandbox', complianceCsid = null, complianceSecret = null,
                  productionCsid = null, productionSecret = null, fetchImpl = null, enabled = false } = {}) {
        this.base = FATOORA_BASE[environment] || FATOORA_BASE.sandbox;
        this.environment = environment;
        this.complianceCsid = complianceCsid; this.complianceSecret = complianceSecret;
        this.productionCsid = productionCsid; this.productionSecret = productionSecret;
        this.enabled = enabled;
        this._fetch = fetchImpl || (typeof fetch === 'function' ? fetch : null);
    }
    _auth(csid, secret) { return 'Basic ' + Buffer.from(`${csid}:${secret}`).toString('base64'); }
    _assertReady(csid, secret) {
        if (!this.enabled) { const e = new Error('ZATCA disabled (set ZATCA_ENABLED=true to transmit)'); e.statusCode = 503; e.code = 'ZATCA_GATED'; throw e; }
        if (!csid || !secret) { const e = new Error('ZATCA CSID/secret not configured'); e.statusCode = 503; e.code = 'ZATCA_NO_CSID'; throw e; }
        if (!this._fetch) { const e = new Error('no fetch implementation available'); e.statusCode = 500; throw e; }
    }
    async _post(path, body, csid, secret, extraHeaders = {}) {
        this._assertReady(csid, secret);
        const res = await this._fetch(this.base + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Version': 'V2', 'Authorization': this._auth(csid, secret), ...extraHeaders },
            body: JSON.stringify(body)
        });
        const text = await res.text();
        let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
        return { status: res.status, ok: res.ok, body: json };
    }
    // POST /compliance — submit CSR (+OTP) to obtain the compliance CSID
    submitCsr(csrBase64, otp) {
        this._assertReady('csr', 'csr'); // only needs enabled + fetch; OTP/CSR are the creds here
        return this._fetch(this.base + '/compliance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept-Version': 'V2', 'OTP': otp },
            body: JSON.stringify({ csr: csrBase64 })
        }).then(async r => ({ status: r.status, ok: r.ok, body: await r.json().catch(() => ({})) }));
    }
    // clearance = standard (B2B) invoices ; reporting = simplified (B2C) invoices
    clearInvoice(payload) { return this._post('/invoices/clearance/single', payload, this.productionCsid, this.productionSecret, { 'Clearance-Status': '1' }); }
    reportInvoice(payload) { return this._post('/invoices/reporting/single', payload, this.productionCsid, this.productionSecret, { 'Clearance-Status': '0' }); }
}

module.exports = {
    tlv, generateKeyPair, publicKeyDer,
    invoiceHash, GENESIS_PIH, nextPih,
    signHashECDSA, verifyHashECDSA,
    buildPhase2QR, decodeQR,
    generateCsrConfig, FatooraClient, FATOORA_BASE
};
