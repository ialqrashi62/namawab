const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNphiesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E11_INS_ROLES, e11Engine, e11Err, e11IntId, e11NphiesEnabled, e11RequireTenant, ensureCOAAccount, idempotencyGuard, optionalReadFallback, postTransactionToGL }) {
    const router = express.Router();
router.get('/api/nphies/eligibility', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_eligibility_checks WHERE tenant_id=$1 ORDER BY id DESC LIMIT 200', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; return e11Err(res, e); }

});

router.post('/api/nphies/eligibility', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const patientId = e11IntId(req.body.patient_id);

        const companyId = e11IntId(req.body.insurance_company_id);

        const policyNumber = String(req.body.policy_number || '');

        if (patientId) {

            const p = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId]);

            if (!p.rows.length) return res.status(404).json({ error: 'Patient not found' });

        }

        if (companyId) {

            const c = await pool.query('SELECT id FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId]);

            if (!c.rows.length) return res.status(404).json({ error: 'Insurance company not found' });

        }

        const intent = JSON.stringify({ patient_id: patientId, insurance_company_id: companyId, policy_number: policyNumber, ts: new Date().toISOString() });

        const ins = await pool.query(

            `INSERT INTO insurance_eligibility_checks (tenant_id, patient_id, insurance_company_id, policy_number, status, nphies_request_json, checked_by)

             VALUES ($1,$2,$3,$4,'pending',$5,$6) RETURNING id`,

            [tenantId, patientId, companyId, policyNumber, intent, req.session.user.id]);

        const checkId = ins.rows[0].id;

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_ELIGIBILITY_CHECK', 'Insurance', `Eligibility #${checkId} (patient ${patientId})`, req.ip);

        

        const settings = (await pool.query('SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name=$2', [tenantId, 'NPHIES'])).rows[0];

        const isNphiesEnabled = e11NphiesEnabled() && settings && settings.is_enabled === 1 && settings.api_key && settings.api_secret && settings.endpoint_url;



        if (!isNphiesEnabled) {

            return res.status(503).json({ error: 'NPHIES integration disabled', gated: true, eligibility_id: checkId, status: 'pending' });

        }

        

        const nphiesClient = require('./nphies_client');

        const patient = patientId ? (await pool.query('SELECT * FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0] : null;

        const company = companyId ? (await pool.query('SELECT * FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId])).rows[0] : null;

        

        const bundle = nphiesClient.buildEligibilityMessage({ patient, company, policy: policyNumber });

        const client = new nphiesClient.NphiesClient({

            endpointUrl: settings.endpoint_url,

            apiKey: settings.api_key,

            apiSecret: settings.api_secret,

            enabled: true,

            fetchImpl: fetch

        });

        

        const result = await client.checkEligibility(bundle);

        const finalStatus = result.ok ? 'eligible' : 'ineligible';

        const responseJson = JSON.stringify(result.body);

        

        await pool.query(

            `UPDATE insurance_eligibility_checks 

             SET status=$1, nphies_request_json=$2, nphies_response_json=$3 

             WHERE id=$4 AND tenant_id=$5`,

            [finalStatus, JSON.stringify(bundle), responseJson, checkId, tenantId]

        );

        

        return res.json({ success: result.ok, eligibility_id: checkId, status: finalStatus, response: result.body });

    } catch (e) { return e11Err(res, e); }

});

router.post('/api/nphies/submit-claim/:id', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e11RequireTenant(req);

        const claimId = e11IntId(req.params.id);

        if (!claimId) return res.status(400).json({ error: 'Invalid claim id' });

        await client.query('BEGIN');

        const cur = await client.query('SELECT id, lifecycle_status FROM insurance_claims WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [claimId, tenantId]);

        if (!cur.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Claim not found' }); }

        if (!e11Engine.canTransitionClaim(cur.rows[0].lifecycle_status, 'submitted')) {

            await client.query('ROLLBACK');

            return res.status(409).json({ error: `Cannot submit from ${cur.rows[0].lifecycle_status}` });

        }

        const intent = JSON.stringify({ claim_id: claimId, ts: new Date().toISOString() });

        await client.query('UPDATE insurance_claims SET nphies_request_json=$1 WHERE id=$2 AND tenant_id=$3', [intent, claimId, tenantId]);

        

        // 1. Fetch NPHIES settings

        const settings = (await client.query('SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name=$2', [tenantId, 'NPHIES'])).rows[0];

        const isNphiesEnabled = e11NphiesEnabled() && settings && settings.is_enabled === 1 && settings.api_key && settings.api_secret && settings.endpoint_url;



        if (!isNphiesEnabled) {

            // GATED: do not flip to submitted without a real NPHIES acknowledgement; record intent only

            await client.query('COMMIT');

            logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_SUBMIT_GATED', 'Insurance', `Claim #${claimId} submit intent (NPHIES off)`, req.ip);

            return res.status(503).json({ error: 'NPHIES integration disabled', gated: true, claim_id: claimId });

        }

        

        // 2. Real NPHIES Call

        const nphiesClient = require('./nphies_client');

        const claim = (await client.query('SELECT * FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId])).rows[0];

        const patient = (await client.query('SELECT * FROM patients WHERE id=$1 AND tenant_id=$2', [claim.patient_id, tenantId])).rows[0];

        const company = (await client.query('SELECT * FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [claim.insurance_company_id, tenantId])).rows[0];

        const lines = (await client.query('SELECT * FROM insurance_claim_lines WHERE claim_id=$1 AND tenant_id=$2', [claimId, tenantId])).rows;

        

        // Gate 8: KSA-conformant FHIR message bundle (claim-request) with ICD-10-AM diagnoses

        // (from claim.diagnosis_icd10 when present) and SBS-coded items (line.sbs_code when present).

        const diagnoses = claim && claim.diagnosis_icd10

            ? [{ icd10: claim.diagnosis_icd10, description: claim.diagnosis_text || '' }]

            : [];

        const bundle = nphiesClient.buildClaimMessage({ patient, company, claim, lines, diagnoses });

        

        const nClient = new nphiesClient.NphiesClient({

            endpointUrl: settings.endpoint_url,

            apiKey: settings.api_key,

            apiSecret: settings.api_secret,

            enabled: true,

            fetchImpl: fetch

        });

        

        const result = await nClient.submitClaim(bundle);

        const nextStatus = result.ok ? 'submitted' : 'denied';

        const responseJson = JSON.stringify(result.body);

        

        // real submission path (when creds present): flip to submitted on acknowledged send

        await client.query(

            `UPDATE insurance_claims 

             SET lifecycle_status=$1, submitted_at=now(), nphies_request_json=$2, nphies_response_json=$3 

             WHERE id=$4 AND tenant_id=$5`,

            [nextStatus, JSON.stringify(bundle), responseJson, claimId, tenantId]

        );

        

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_SUBMIT_CLAIM', 'Insurance', `Claim #${claimId} submitted to NPHIES`, req.ip);

        res.json({ success: result.ok, claim_id: claimId, lifecycle_status: nextStatus, response: result.body });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} return e11Err(res, e); }

    finally { client.release(); }

});

router.get('/api/nphies/remittance', requireAuth, requireRole('finance', 'accounts', 'insurance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { claim_id, status, page = 1, limit = 50 } = req.query;

        let q = 'SELECT r.*, COALESCE(ic.id::text, r.claim_id::text) AS claim_number, ic.patient_name FROM nphies_remittance_advice r LEFT JOIN insurance_claims ic ON r.claim_id=ic.id WHERE r.tenant_id=$1';

        const params = [tid];

        if (claim_id) { params.push(parseInt(claim_id)); q += ` AND r.claim_id=$${params.length}`; }

        if (status) { params.push(status); q += ` AND r.adjudication_status=$${params.length}`; }

        q += ` ORDER BY r.remittance_date DESC LIMIT ${Math.min(parseInt(limit)||50,200)} OFFSET ${(Math.max(parseInt(page)||1,1)-1)*(Math.min(parseInt(limit)||50,200))}`;

        const rows = await pool.query(q, params);

        res.json(rows.rows);

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.post('/api/nphies/remittance', requireAuth, requireRole('finance', 'accounts', 'insurance'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { claim_id, payer_id, remittance_date, payment_amount = 0, adjustment_amount = 0,

                denial_amount = 0, payment_date, payment_reference, adjudication_status = 'pending',

                denial_reason, fhir_bundle_id } = req.body;

        if (!claim_id) return res.status(400).json({ error: 'claim_id required' });

        // IDOR: verify claim belongs to tenant

        const claimCheck = await pool.query('SELECT id FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [parseInt(claim_id), tid]);

        if (!claimCheck.rows.length) return res.status(403).json({ error: 'Claim not found or access denied' });

        const r = await pool.query(

            `INSERT INTO nphies_remittance_advice (claim_id, payer_id, remittance_date, fhir_bundle_id, payment_amount,

             adjustment_amount, denial_amount, payment_date, payment_reference, adjudication_status, denial_reason, tenant_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,

            [parseInt(claim_id), payer_id||null, remittance_date||new Date().toISOString().slice(0,10),

             fhir_bundle_id||'', parseFloat(payment_amount)||0, parseFloat(adjustment_amount)||0,

             parseFloat(denial_amount)||0, payment_date||null, payment_reference||'',

             adjudication_status, denial_reason||'', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_RA_CREATE', 'NPHIES', `Remittance RA#${r.rows[0].id} for Claim#${claim_id}`, tid);

        res.json({ success: true, remittance: r.rows[0] });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.post('/api/nphies/remittance/:id/post-to-ar', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        

        await client.query('BEGIN');

        await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tid)]);

        

        const ra = (await client.query('SELECT * FROM nphies_remittance_advice WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [id, tid])).rows[0];

        if (!ra) {

            await client.query('ROLLBACK');

            return res.status(404).json({ error: 'Remittance not found' });

        }

        if (ra.posted_to_gl) {

            await client.query('ROLLBACK');

            return res.status(409).json({ error: 'Already posted to GL/AR' });

        }

        

        // Mark posted

        await client.query('UPDATE nphies_remittance_advice SET posted_to_gl=TRUE, posted_at=NOW(), posted_by=$1 WHERE id=$2 AND tenant_id=$3',

            [req.session.user.display_name, id, tid]);

            

        // Update claim payment status

        if (ra.claim_id) {

            await client.query("UPDATE insurance_claims SET payment_status='Paid', paid_amount=$1, payment_date=$2 WHERE id=$3 AND tenant_id=$4",

                [ra.payment_amount, ra.payment_date||new Date().toISOString().slice(0,10), ra.claim_id, tid]);

        }

        

        // --- Gate 10: GL Posting Integration ---

        // 1. Get or create GL accounts

        const cashAccId = await ensureCOAAccount(tid, '1111-NPHIES', 'NPHIES Cash Clearing', 'حساب تسوية نقدية نافيس', 'ASSET', client);

        const arAccId = await ensureCOAAccount(tid, '1201-NPHIES', 'NPHIES Insurance Receivables', 'ذمم شركات التأمين نافيس', 'ASSET', client);

        const writeoffAccId = await ensureCOAAccount(tid, '5102-NPHIES', 'NPHIES Contractual Write-offs', 'تسويات مرفوضات التأمين نافيس', 'EXPENSE', client);

        

        const payVal = parseFloat(ra.payment_amount || 0);

        const denialVal = parseFloat(ra.denial_amount || 0);

        const totalARVal = payVal + denialVal;

        

        const lines = [];

        if (payVal > 0) {

            lines.push({ accountId: cashAccId, debit: payVal, credit: 0, notes: `NPHIES remittance approved payment RA#${id}` });

        }

        if (denialVal > 0) {

            lines.push({ accountId: writeoffAccId, debit: denialVal, credit: 0, notes: `NPHIES remittance write-offs RA#${id}` });

        }

        if (totalARVal > 0) {

            lines.push({ accountId: arAccId, debit: 0, credit: totalARVal, notes: `NPHIES remittance claim offset RA#${id}` });

        }

        

        if (lines.length >= 2) {

            const entryNumber = 'JV-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-8);

            await postTransactionToGL(tid, entryNumber, `NPHIES Remittance Advice settlement RA#${id}`, `NPHIES-RA-${id}`, 'SYSTEM', lines, client);

        }

        

        await client.query('COMMIT');

        

        logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_RA_POST_AR', 'NPHIES', `RA#${id} posted to AR, Claim#${ra.claim_id} paid SAR${ra.payment_amount}`, tid);

        res.json({ success: true, message: 'Remittance posted to AR and GL successfully' });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) {}

        console.error(e);

        res.status(500).json({ error: e.message });

    } finally {

        client.release();

    }

});

router.post('/api/nphies/claim-status-inquiry', requireAuth, requireRole('finance', 'accounts', 'insurance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { claim_id } = req.body;

        if (!claim_id) return res.status(400).json({ error: 'claim_id required' });

        const claimCheck = await pool.query('SELECT * FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [parseInt(claim_id), tid]);

        if (!claimCheck.rows.length) return res.status(403).json({ error: 'Claim not found or access denied' });

        const claim = claimCheck.rows[0];

        // Build FHIR Task bundle (Status Inquiry)

        const taskBundle = {

            resourceType: 'Bundle', type: 'message',

            entry: [{

                resource: {

                    resourceType: 'Task', status: 'requested',

                    intent: 'order', code: { coding: [{ system: 'http://nphies.sa/CodeSystem/task-code', code: 'status-check' }] },

                    focus: { reference: `Claim/${claim.nphies_claim_id || claim.id}` },

                    for: { identifier: { system: 'https://nphies.sa/national-id', value: claim.national_id || '' } },

                    authoredOn: new Date().toISOString()

                }

            }]

        };

        // Log inquiry

        const r = await pool.query(

            `INSERT INTO nphies_claim_status_inquiry (claim_id, fhir_task_id, nphies_request_json, tenant_id)

             VALUES ($1,$2,$3,$4) RETURNING id`,

            [parseInt(claim_id), `task-${Date.now()}`, JSON.stringify(taskBundle), tid]

        );

        // GATED: if NPHIES disabled, return stub

        if (!e11NphiesEnabled()) {

            await pool.query("UPDATE nphies_claim_status_inquiry SET status_code='GATED', status_description='NPHIES integration disabled - inquiry recorded' WHERE id=$1", [r.rows[0].id]);

            logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_STATUS_INQUIRY_GATED', 'NPHIES', `Claim#${claim_id} status inquiry gated`, tid);

            return res.status(503).json({ gated: true, inquiry_id: r.rows[0].id, fhir_bundle: taskBundle, message: 'NPHIES disabled – inquiry logged' });

        }

        // Real NPHIES call (when enabled)

        logAudit(req.session.user.id, req.session.user.display_name, 'NPHIES_STATUS_INQUIRY', 'NPHIES', `Claim#${claim_id} status inquiry sent`, tid);

        res.json({ success: true, inquiry_id: r.rows[0].id, fhir_bundle: taskBundle });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});

router.get('/api/nphies/remittance/summary', requireAuth, requireRole('finance', 'accounts', 'insurance'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const r = await pool.query(`

            SELECT

                COUNT(*) total_records,

                COALESCE(SUM(payment_amount),0) total_paid,

                COALESCE(SUM(adjustment_amount),0) total_adjusted,

                COALESCE(SUM(denial_amount),0) total_denied,

                COUNT(*) FILTER (WHERE adjudication_status='approved') approved_count,

                COUNT(*) FILTER (WHERE adjudication_status='denied') denied_count,

                COUNT(*) FILTER (WHERE adjudication_status='pending') pending_count,

                COUNT(*) FILTER (WHERE posted_to_gl=FALSE AND adjudication_status='approved') unposted_approved

            FROM nphies_remittance_advice WHERE tenant_id=$1`, [tid]);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
