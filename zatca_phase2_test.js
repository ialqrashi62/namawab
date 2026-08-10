/**
 * zatca_phase2_test.js — unit tests for ./zatca_phase2 (Node stdlib crypto only, no network, no creds).
 * Run: node zatca_phase2_test.js   (exit 0 = all pass)
 */
'use strict';
const Z = require('./zatca_phase2');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('  FAIL:', name); } }

// ---- key generation (secp256k1) ----
const kp = Z.generateKeyPair();
ok('keypair has private PEM', /BEGIN PRIVATE KEY/.test(kp.privateKeyPem));
ok('keypair has public PEM', /BEGIN PUBLIC KEY/.test(kp.publicKeyPem));
const pubDer = Z.publicKeyDer(kp.publicKeyPem);
ok('public DER is a Buffer', Buffer.isBuffer(pubDer) && pubDer.length > 0);

// ---- invoice hash + PIH chain ----
const h1 = Z.invoiceHash('<Invoice>one</Invoice>');
const h1b = Z.invoiceHash('<Invoice>one</Invoice>');
const h2 = Z.invoiceHash('<Invoice>two</Invoice>');
ok('hash is deterministic', h1 === h1b);
ok('hash differs by content', h1 !== h2);
ok('hash is base64 32-byte', Buffer.from(h1, 'base64').length === 32);
ok('genesis PIH = sha256("0") b64', Z.GENESIS_PIH === require('crypto').createHash('sha256').update('0').digest('base64'));
ok('nextPih falls back to genesis when empty', Z.nextPih('') === Z.GENESIS_PIH);
ok('nextPih passes through a real prior hash', Z.nextPih(h1) === h1);

// ---- ECDSA sign / verify round-trip ----
const sig = Z.signHashECDSA(h1, kp.privateKeyPem);
ok('signature is base64 non-empty', typeof sig === 'string' && Buffer.from(sig, 'base64').length > 8);
ok('verify accepts a valid signature', Z.verifyHashECDSA(h1, sig, kp.publicKeyPem) === true);
ok('verify rejects a tampered hash', Z.verifyHashECDSA(h2, sig, kp.publicKeyPem) === false);
ok('verify rejects a wrong key', Z.verifyHashECDSA(h1, sig, Z.generateKeyPair().publicKeyPem) === false);

// ---- Phase-2 QR: 9 tags, round-trip decode ----
const qr = Z.buildPhase2QR({
    sellerName: 'Jumana Medical', sellerVat: '300000000000003', timestamp: '2026-06-30T10:00:00Z',
    total: '115.00', vat: '15.00', invoiceHashB64: h1, signatureB64: sig, publicKeyDerBuf: pubDer,
    caSignatureB64: Buffer.from('ca-stamp-bytes').toString('base64')
});
const dec = Z.decodeQR(qr);
ok('QR is base64', Buffer.from(qr, 'base64').toString('base64') === qr);
ok('QR tag1 sellerName', dec[1].toString('utf8') === 'Jumana Medical');
ok('QR tag2 vat', dec[2].toString('utf8') === '300000000000003');
ok('QR tag4 total', dec[4].toString('utf8') === '115.00');
ok('QR tag5 vat amount', dec[5].toString('utf8') === '15.00');
ok('QR tag6 = invoice hash', dec[6].toString('utf8') === h1);
ok('QR tag7 = signature', dec[7].toString('utf8') === sig);
ok('QR tag8 = public key DER bytes', Buffer.compare(dec[8], pubDer) === 0);
ok('QR tag9 present (CA stamp)', dec[9] && dec[9].length > 0);

// simplified invoice (no CA stamp) => tag 9 absent
const qrSimple = Z.buildPhase2QR({ sellerName: 'X', sellerVat: '3', timestamp: 't', total: '1', vat: '0', invoiceHashB64: h1, signatureB64: sig, publicKeyDerBuf: pubDer });
ok('simplified QR omits tag 9', Z.decodeQR(qrSimple)[9] === undefined);

// ---- CSR config ----
const csr = Z.generateCsrConfig({ commonName: 'EGS1', serialNumber: '1-Nama|2-ERP|3-001', organizationIdentifier: '300000000000003', organizationName: 'Jumana', organizationUnitName: 'Riyadh', environment: 'sandbox' });
ok('csr config has req section', /\[req\]/.test(csr.config));
ok('csr config has ZATCA template OID', /1\.3\.6\.1\.4\.1\.311\.20\.2/.test(csr.config));
ok('csr config carries sandbox title', /TSTZATCA-Code-Signing/.test(csr.config));
ok('csr config carries UID (org id)', /UID = 300000000000003/.test(csr.config));
ok('csr commands include openssl genkey', csr.commands.some(c => /ecparam -name secp256k1/.test(c)));

// ---- FatooraClient gating (no creds => never transmits) ----
(async () => {
    const c = new Z.FatooraClient({ environment: 'sandbox', enabled: false });
    let gated = false;
    try { await c.clearInvoice({}); } catch (e) { gated = e.code === 'ZATCA_GATED'; }
    ok('client refuses when disabled (ZATCA_GATED)', gated);

    const c2 = new Z.FatooraClient({ environment: 'production', enabled: true, fetchImpl: async () => ({ ok: true, status: 200, text: async () => '{}' }) });
    let noCsid = false;
    try { await c2.reportInvoice({}); } catch (e) { noCsid = e.code === 'ZATCA_NO_CSID'; }
    ok('client refuses without CSID (ZATCA_NO_CSID)', noCsid);

    // configured => transmits via injected fetch
    let called = null;
    const c3 = new Z.FatooraClient({
        environment: 'production', enabled: true, productionCsid: 'cid', productionSecret: 'sec',
        fetchImpl: async (url, opts) => { called = { url, opts }; return { ok: true, status: 200, text: async () => '{"clearanceStatus":"CLEARED"}' }; }
    });
    const r = await c3.clearInvoice({ invoiceHash: 'x' });
    ok('configured client transmits', called && /invoices\/clearance\/single/.test(called.url));
    ok('configured client sends Basic auth', /^Basic /.test(called.opts.headers['Authorization']));
    ok('configured client parses response', r.ok && r.body.clearanceStatus === 'CLEARED');

    console.log(`zatca_phase2_test: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
})();
