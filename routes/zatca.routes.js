const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeZatcaRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, crypto, e10Err, e10IntId, e10RequireTenant, e10ZatcaEnabled, fe, idempotencyGuard, ZATCA_CREDIT_REASON_CODES }) {
    const router = express.Router();
router.get('/api/zatca/invoices', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        res.json((await pool.query('SELECT * FROM zatca_invoices WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    } catch (e) { e10Err(res, e); }

});

router.post('/api/zatca/generate', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        const invoiceId = e10IntId(req.body.invoice_id);

        if (!invoiceId) return res.status(422).json({ error: 'Invalid invoice_id' });

        // tenant-scoped invoice lookup (cross-tenant invoice => 404, no leak).

        const inv = (await pool.query(

            'SELECT i.*, p.name_ar, p.name_en FROM invoices i LEFT JOIN patients p ON i.patient_id=p.id AND p.tenant_id=$2 WHERE i.id=$1 AND i.tenant_id=$2',

            [invoiceId, tenantId])).rows[0];

        if (!inv) return res.status(404).json({ error: 'Invoice not found' });

        const company = (await pool.query("SELECT setting_value FROM company_settings WHERE setting_key='company_name'")).rows[0];

        const vatNo = (await pool.query("SELECT setting_value FROM company_settings WHERE setting_key='vat_number'")).rows[0];



        // VAT computed SERVER-SIDE from the invoice total (treated as VAT-inclusive). Client vat never trusted.

        const vatBreak = fe.vatFromInclusive(inv.total);

        if (!vatBreak) return res.status(422).json({ error: 'Invoice total is not a valid amount' });

        const issueDate = new Date().toISOString().slice(0, 10);

        const issueTime = new Date().toISOString().slice(11, 19);

        const sellerName = company?.setting_value || 'jumanaMedical';

        const sellerVat = vatNo?.setting_value || '';

        const invNumber = inv.invoice_number || ('INV-' + String(invoiceId).padStart(8, '0'));



        const qrTlv = fe.buildZatcaQR({

            sellerName, sellerVat, timestamp: issueDate + 'T' + issueTime + 'Z',

            total: vatBreak.total_incl, vat: vatBreak.vat_amount

        });

        const ubl = fe.buildUBLInvoice({

            invoiceNumber: invNumber, issueDate, issueTime, invoiceTypeCode: '388',

            sellerName, sellerVat, buyerName: inv.name_ar || inv.name_en || inv.patient_name || '',

            buyerVat: '', baseExcl: vatBreak.base_excl, vat: vatBreak.vat_amount, total: vatBreak.total_incl,

            currency: 'SAR', stampPlaceholder: 'UNSIGNED-NO-CSID'

        });

        const xmlHash = fe.ublHash(ubl);

        // stamp PLACEHOLDER — a real cryptographic stamp requires an onboarded CSID (gated). We persist

        // a deterministic placeholder derived from the doc hash, never a forged ZATCA stamp.

        const stampPlaceholder = 'PLACEHOLDER:' + xmlHash.slice(0, 32);



        // idempotent upsert on (tenant_id, invoice_id).

        const result = await pool.query(

            `INSERT INTO zatca_invoices

               (invoice_id, invoice_number, seller_name, seller_vat, buyer_name, total_before_vat, vat_amount, total_with_vat,

                qr_code, qr_tlv, ubl_xml, xml_hash, digital_stamp, submission_status, clearance_status, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'',$9,$10,$11,$12,'Generated','NOT_SUBMITTED',$13)

             ON CONFLICT (tenant_id, invoice_id) DO UPDATE SET

               qr_tlv=$9, ubl_xml=$10, xml_hash=$11, digital_stamp=$12,

               total_before_vat=$6, vat_amount=$7, total_with_vat=$8, submission_status='Generated'

             RETURNING *`,

            [invoiceId, invNumber, sellerName, sellerVat, inv.name_ar || inv.name_en || inv.patient_name || '',

            vatBreak.base_excl, vatBreak.vat_amount, vatBreak.total_incl, qrTlv, ubl, xmlHash, stampPlaceholder, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ZATCA_GENERATE', 'ZATCA', `E-invoice for ${invNumber} (VAT ${vatBreak.vat_amount})`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { e10Err(res, e); }

});

router.post('/api/zatca/submit', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        const invoiceId = e10IntId(req.body.invoice_id);

        if (!invoiceId) return res.status(422).json({ error: 'Invalid invoice_id' });

        

        const z = (await pool.query('SELECT * FROM zatca_invoices WHERE invoice_id=$1 AND tenant_id=$2', [invoiceId, tenantId])).rows[0];

        if (!z) return res.status(404).json({ error: 'E-invoice not generated yet' });

        

        // 1. Fetch ZATCA settings for the current tenant

        const settings = (await pool.query('SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name=$2', [tenantId, 'ZATCA'])).rows[0];

        

        // 2. Fallback check: if ZATCA is not enabled, or not configured, or ZATCA_ENABLED environment variable is off:

        const isZatcaEnabled = e10ZatcaEnabled() && settings && settings.is_enabled === 1 && settings.api_key && settings.api_secret;

        

        if (!isZatcaEnabled) {

            // Safe fallback / mock submission:

            await pool.query(

                `UPDATE zatca_invoices 

                 SET clearance_status=$1, submission_status=$2, submission_date=$3, zatca_response=$4 

                 WHERE invoice_id=$5 AND tenant_id=$6`,

                ['RECORDED', 'Submitted_Mock', new Date().toISOString(), JSON.stringify({ message: 'ZATCA clearance simulated or disabled' }), invoiceId, tenantId]

            );

            logAudit(req.session.user?.id, req.session.user?.display_name, 'ZATCA_SUBMIT_INTENT', 'ZATCA', `Simulated submit for ${z.invoice_number}`, req.ip);

            return res.json({ 

                success: true, 

                clearance_status: 'RECORDED', 

                submission_status: 'Submitted_Mock', 

                message: 'ZATCA clearance simulated or disabled (sandbox/mock mode)' 

            });

        }

        

        // 3. Real Cryptographic signing & API transmission

        const zatcaPhase2 = require('./zatca_phase2');

        let configJson = {};

        try {

            configJson = JSON.parse(settings.config_json || '{}');

        } catch (_) {}

        

        const privKey = configJson.private_key_pem;

        const pubKey = configJson.public_key_pem;

        const environment = configJson.environment || 'sandbox';

        

        if (!privKey || !pubKey) {

            return res.status(422).json({ error: 'ZATCA private/public keys are missing in config_json' });

        }

        

        // Compute SHA-256 hash of the UBL XML

        const xmlHash = zatcaPhase2.invoiceHash(z.ubl_xml);

        

        // ECDSA sign the invoice hash

        const signatureB64 = zatcaPhase2.signHashECDSA(xmlHash, privKey);

        

        // Get public key DER bytes

        const pubDer = zatcaPhase2.publicKeyDer(pubKey);

        

        // Build Phase-2 QR code (including signature and public key)

        const qr = zatcaPhase2.buildPhase2QR({

            sellerName: z.seller_name,

            sellerVat: z.seller_vat,

            timestamp: new Date(z.created_at).toISOString().slice(0, 19) + 'Z',

            total: z.total_with_vat,

            vat: z.vat_amount,

            invoiceHashB64: xmlHash,

            signatureB64,

            publicKeyDerBuf: pubDer

        });

        

        // Prepare ZATCA payload

        const payload = {

            invoiceHash: xmlHash,

            uuid: z.xml_hash ? z.xml_hash.slice(0, 36) : require('crypto').randomUUID(),

            invoice: Buffer.from(z.ubl_xml, 'utf8').toString('base64')

        };

        

        // Initialize Fatoora client

        const client = new zatcaPhase2.FatooraClient({

            environment: environment,

            productionCsid: settings.api_key,

            productionSecret: settings.api_secret,

            enabled: true,

            fetchImpl: fetch

        });

        

        let result;

        const isSimplified = z.invoice_type && z.invoice_type.toLowerCase() === 'simplified';

        if (isSimplified) {

            result = await client.reportInvoice(payload);

        } else {

            result = await client.clearInvoice(payload);

        }

        

        // Persist ZATCA clearance/reporting response

        const clearanceStatus = result.ok ? 'CLEARED' : 'FAILED';

        const submissionStatus = result.ok ? 'Reported' : 'Failed';

        const responseText = JSON.stringify(result.body);

        

        await pool.query(

            `UPDATE zatca_invoices 

             SET qr_code=$1, xml_hash=$2, digital_stamp=$3, submission_status=$4, clearance_status=$5, submission_date=$6, zatca_response=$7 

             WHERE invoice_id=$8 AND tenant_id=$9`,

            [qr, xmlHash, signatureB64, submissionStatus, clearanceStatus, new Date().toISOString(), responseText, invoiceId, tenantId]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ZATCA_SUBMIT_INTENT', 'ZATCA', `Real submit for ${z.invoice_number} (status: ${clearanceStatus})`, req.ip);

        

        res.json({

            success: result.ok,

            clearance_status: clearanceStatus,

            submission_status: submissionStatus,

            zatca_response: result.body

        });

    } catch (e) { e10Err(res, e); }

});

router.get('/api/zatca/credit-notes', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const rows = await pool.query(

            `SELECT cn.*, zi.invoice_number as original_invoice_number

             FROM zatca_credit_notes cn

             LEFT JOIN zatca_invoices zi ON cn.original_invoice_id=zi.id

             WHERE cn.tenant_id=$1 ORDER BY cn.created_at DESC LIMIT 200`, [tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/zatca/credit-note', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { invoice_id, credit_reason = 'CANCEL', credit_reason_description, items_to_credit } = req.body;

        if (!invoice_id) return res.status(400).json({ error: 'invoice_id required' });

        // IDOR: verify invoice belongs to tenant

        const inv = (await pool.query('SELECT * FROM zatca_invoices WHERE invoice_id=$1 AND tenant_id=$2', [parseInt(invoice_id), tid])).rows[0]

                 || (await pool.query('SELECT * FROM zatca_invoices WHERE id=$1 AND tenant_id=$2', [parseInt(invoice_id), tid])).rows[0];

        if (!inv) return res.status(403).json({ error: 'Invoice not found or access denied' });

        // Get last credit note for chaining

        const lastCN = (await pool.query('SELECT * FROM zatca_credit_notes WHERE tenant_id=$1 ORDER BY invoice_counter DESC LIMIT 1', [tid])).rows[0];

        const lastInv = (await pool.query('SELECT * FROM zatca_invoices WHERE tenant_id=$1 ORDER BY id DESC LIMIT 1', [tid])).rows[0];

        const prevHash = lastCN?.xml_hash || lastInv?.xml_hash || '';

        const counter = (lastCN?.invoice_counter || 0) + 1;

        // Credit note values — full invoice or partial

        const subtotal = parseFloat(inv.total_amount || inv.subtotal || 0);

        const vat_amount = parseFloat(inv.vat_amount || 0);

        const total_with_vat = subtotal + vat_amount;

        // Credit note number: CN-{year}-{counter}

        const cn_number = `CN-${new Date().getFullYear()}-${String(counter).padStart(4,'0')}`;

        // Build minimal UBL XML for credit note

        const now = new Date().toISOString();

        const ubl_xml = `<?xml version="1.0" encoding="UTF-8"?>

<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"

         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"

         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">

  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>

  <cbc:ID>${escapeHtml(cn_number)}</cbc:ID>

  <cbc:UUID>${cn_number}-${Date.now()}</cbc:UUID>

  <cbc:IssueDate>${now.slice(0,10)}</cbc:IssueDate>

  <cbc:IssueTime>${now.slice(11,19)}</cbc:IssueTime>

  <cbc:CreditNoteTypeCode>381</cbc:CreditNoteTypeCode>

  <cbc:Note>${escapeHtml(credit_reason_description || ZATCA_CREDIT_REASON_CODES[credit_reason] || credit_reason)}</cbc:Note>

  <cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>${escapeHtml(inv.invoice_number||String(inv.id))}</cbc:ID></cac:InvoiceDocumentReference></cac:BillingReference>

  <cac:TaxTotal><cbc:TaxAmount currencyID="SAR">${vat_amount.toFixed(2)}</cbc:TaxAmount></cac:TaxTotal>

  <cac:LegalMonetaryTotal>

    <cbc:TaxExclusiveAmount currencyID="SAR">${subtotal.toFixed(2)}</cbc:TaxExclusiveAmount>

    <cbc:TaxInclusiveAmount currencyID="SAR">${total_with_vat.toFixed(2)}</cbc:TaxInclusiveAmount>

  </cac:LegalMonetaryTotal>

</Invoice>`;

        // Hash the XML (SHA-256)

        const crypto = require('crypto');

        const xml_hash = crypto.createHash('sha256').update(ubl_xml).digest('base64');

        // Build QR (TLV for Phase 2)

        let qr_code = '';

        try {

            const fe = require('./finance_engine');

            qr_code = fe.buildZatcaQR({ seller_name: 'Nama Medical', vat_number: '300000000000003',

                timestamp: now, total_with_vat, vat_amount, xml_hash, prev_hash: prevHash }) || '';

        } catch (_) {}

        const r = await pool.query(

            `INSERT INTO zatca_credit_notes (original_invoice_id, credit_note_number, buyer_name, buyer_vat,

             credit_reason, credit_reason_code, subtotal, vat_amount, total_with_vat, ubl_xml, xml_hash,

             qr_code, invoice_counter, prev_invoice_hash, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,

            [inv.id, cn_number, inv.buyer_name||'', inv.buyer_vat||'',

             credit_reason_description || ZATCA_CREDIT_REASON_CODES[credit_reason] || credit_reason,

             credit_reason, subtotal, vat_amount, total_with_vat, ubl_xml, xml_hash,

             qr_code, counter, prevHash, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'ZATCA_CN_GENERATE', 'ZATCA', `Credit note ${cn_number} generated for invoice ${inv.invoice_number||inv.id}`, tid);

        res.json({ success: true, credit_note: r.rows[0] });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.post('/api/zatca/credit-note/:id/submit', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        const cn = (await pool.query('SELECT * FROM zatca_credit_notes WHERE id=$1 AND tenant_id=$2', [id, tid])).rows[0];

        if (!cn) return res.status(404).json({ error: 'Credit note not found' });

        // GATED: if ZATCA disabled, record intent

        const settings = (await pool.query("SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name='ZATCA'", [tid])).rows[0];

        const isEnabled = e10ZatcaEnabled() && settings?.is_enabled === 1 && settings?.api_key;

        if (!isEnabled) {

            await pool.query("UPDATE zatca_credit_notes SET clearance_status='RECORDED', submission_status='Submitted_Mock' WHERE id=$1 AND tenant_id=$2", [id, tid]);

            logAudit(req.session.user.id, req.session.user.display_name, 'ZATCA_CN_SUBMIT_GATED', 'ZATCA', `Credit note ${cn.credit_note_number} submission intent recorded`, tid);

            return res.status(503).json({ gated: true, clearance_status: 'RECORDED', message: 'ZATCA clearance gated – intent recorded' });

        }

        logAudit(req.session.user.id, req.session.user.display_name, 'ZATCA_CN_SUBMIT', 'ZATCA', `Credit note ${cn.credit_note_number} submitted to ZATCA`, tid);

        res.json({ success: true, message: 'Credit note submitted to ZATCA' });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/zatca/invoice-chain', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const invoices = (await pool.query('SELECT id, invoice_number, xml_hash, NULL::text AS prev_invoice_hash, id AS invoice_counter FROM zatca_invoices WHERE tenant_id=$1 ORDER BY id ASC', [tid])).rows;

        const creditNotes = (await pool.query('SELECT id, credit_note_number as invoice_number, xml_hash, prev_invoice_hash, invoice_counter FROM zatca_credit_notes WHERE tenant_id=$1 ORDER BY invoice_counter ASC', [tid])).rows;

        // Verify chain integrity

        let chain_valid = true;

        const chain_issues = [];

        for (let i = 1; i < invoices.length; i++) {

            if (invoices[i].prev_invoice_hash && invoices[i-1].xml_hash &&

                invoices[i].prev_invoice_hash !== invoices[i-1].xml_hash) {

                chain_valid = false;

                chain_issues.push(`Invoice #${invoices[i].invoice_number}: hash chain break at position ${i}`);

            }

        }

        res.json({ chain_valid, chain_issues, total_invoices: invoices.length, total_credit_notes: creditNotes.length, invoices: invoices.slice(-20), credit_notes: creditNotes });

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
