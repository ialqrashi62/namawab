const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeInsuranceRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E11_INS_ROLES, e11Engine, e11Err, e11IntId, e11Money, e11NphiesEnabled, e11RequireTenant, idempotencyGuard, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/insurance/companies', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_companies WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { return e11Err(res, e); }

});

router.post('/api/insurance/companies', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const { name_ar, name_en, contact_info } = req.body;

        const result = await pool.query(

            'INSERT INTO insurance_companies (tenant_id, name_ar, name_en, contact_info) VALUES ($1,$2,$3,$4) RETURNING id',

            [tenantId, name_ar || '', name_en || '', contact_info || '']);

        logAudit(req.session.user.id, req.session.user.display_name, 'CREATE_INSURANCE_COMPANY', 'Insurance', `Company #${result.rows[0].id}`, req.ip);

        res.json((await pool.query('SELECT * FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0]);

    } catch (e) { return e11Err(res, e); }

});

router.get('/api/insurance/policies', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_policies WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { return e11Err(res, e); }

});

router.get('/api/insurance/eligibility', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_eligibility_checks WHERE tenant_id=$1 ORDER BY id DESC LIMIT 200', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; return e11Err(res, e); }

});

router.post('/api/insurance/eligibility', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const patientId = e11IntId(req.body.patient_id);

        const companyId = e11IntId(req.body.insurance_company_id);

        const policyNumber = String(req.body.policy_number || '');

        // verify referenced entities belong to this tenant (no cross-tenant linkage)

        if (patientId) {

            const p = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId]);

            if (!p.rows.length) return res.status(404).json({ error: 'Patient not found' });

        }

        if (companyId) {

            const c = await pool.query('SELECT id FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId]);

            if (!c.rows.length) return res.status(404).json({ error: 'Insurance company not found' });

        }

        const intent = JSON.stringify({ patient_id: patientId, insurance_company_id: companyId, policy_number: policyNumber, ts: new Date().toISOString() });

        // record the eligibility request (status='pending'); status is server-authoritative (never from client)

        const ins = await pool.query(

            `INSERT INTO insurance_eligibility_checks (tenant_id, patient_id, insurance_company_id, policy_number, status, nphies_request_json, checked_by)

             VALUES ($1,$2,$3,$4,'pending',$5,$6) RETURNING id`,

            [tenantId, patientId, companyId, policyNumber, intent, req.session.user.id]);

        const checkId = ins.rows[0].id;

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_ELIGIBILITY_CHECK', 'Insurance', `Eligibility #${checkId} (patient ${patientId})`, req.ip);

        

        // 1. Fetch NPHIES settings

        const settings = (await pool.query('SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name=$2', [tenantId, 'NPHIES'])).rows[0];

        const isNphiesEnabled = e11NphiesEnabled() && settings && settings.is_enabled === 1 && settings.api_key && settings.api_secret && settings.endpoint_url;



        if (!isNphiesEnabled) {

            // GATED: no real NPHIES creds — return 503 + the recorded intent (do NOT fabricate eligibility)

            return res.status(503).json({ error: 'NPHIES integration disabled', gated: true, eligibility_id: checkId, status: 'pending' });

        }

        

        // 2. Real NPHIES Call

        const nphiesClient = require('./nphies_client');

        const patient = patientId ? (await pool.query('SELECT * FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0] : null;

        const company = companyId ? (await pool.query('SELECT * FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId])).rows[0] : null;

        

        // Gate 8: KSA-conformant FHIR message bundle (was a minimal collection bundle).

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

router.get('/api/insurance/pre-auth', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_pre_authorizations WHERE tenant_id=$1 ORDER BY id DESC LIMIT 200', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; return e11Err(res, e); }

});

router.post('/api/insurance/pre-auth', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const patientId = e11IntId(req.body.patient_id);

        const admissionId = e11IntId(req.body.admission_id);

        const companyId = e11IntId(req.body.insurance_company_id);

        const requested = e11Money(req.body.requested_amount) || 0;

        const justification = String(req.body.clinical_justification || '');

        if (patientId) {

            const p = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId]);

            if (!p.rows.length) return res.status(404).json({ error: 'Patient not found' });

        }

        if (admissionId) {

            const a = await pool.query('SELECT id FROM admissions WHERE id=$1 AND tenant_id=$2', [admissionId, tenantId]);

            if (!a.rows.length) return res.status(404).json({ error: 'Admission not found' });

        }

        if (companyId) {

            const c = await pool.query('SELECT id FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId]);

            if (!c.rows.length) return res.status(404).json({ error: 'Insurance company not found' });

        }

        // always created in 'requested' state — client cannot pre-set approved (anti-spoof)

        const intent = JSON.stringify({ patient_id: patientId, admission_id: admissionId, insurance_company_id: companyId, requested_amount: requested, ts: new Date().toISOString() });

        const ins = await pool.query(

            `INSERT INTO insurance_pre_authorizations (tenant_id, patient_id, admission_id, insurance_company_id, requested_amount, auth_status, clinical_justification, nphies_request_json, requested_by)

             VALUES ($1,$2,$3,$4,$5,'requested',$6,$7,$8) RETURNING id`,

            [tenantId, patientId, admissionId, companyId, requested, justification, intent, req.session.user.id]);

        const paId = ins.rows[0].id;

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_PREAUTH_REQUEST', 'Insurance', `PreAuth #${paId} (patient ${patientId})`, req.ip);

        

        // 1. Fetch NPHIES settings

        const settings = (await pool.query('SELECT * FROM integration_settings WHERE tenant_id=$1 AND integration_name=$2', [tenantId, 'NPHIES'])).rows[0];

        const isNphiesEnabled = e11NphiesEnabled() && settings && settings.is_enabled === 1 && settings.api_key && settings.api_secret && settings.endpoint_url;



        if (!isNphiesEnabled) {

            return res.status(503).json({ error: 'NPHIES integration disabled', gated: true, pre_auth_id: paId, auth_status: 'requested' });

        }

        

        // 2. Real NPHIES Call

        const nphiesClient = require('./nphies_client');

        const patient = patientId ? (await pool.query('SELECT * FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0] : null;

        const company = companyId ? (await pool.query('SELECT * FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId])).rows[0] : null;

        

        const preAuthRecord = { id: paId, requested_amount: requested, amount: requested };

        // Gate 8: KSA-conformant FHIR message bundle (priorauth-request).

        const bundle = nphiesClient.buildPreAuthMessage({ patient, company, preAuth: preAuthRecord });

        

        const client = new nphiesClient.NphiesClient({

            endpointUrl: settings.endpoint_url,

            apiKey: settings.api_key,

            apiSecret: settings.api_secret,

            enabled: true,

            fetchImpl: fetch

        });

        

        const result = await client.requestPreAuth(bundle);

        const authStatus = result.ok ? 'approved' : 'denied';

        const responseJson = JSON.stringify(result.body);

        

        await pool.query(

            `UPDATE insurance_pre_authorizations 

             SET auth_status=$1, nphies_request_json=$2, nphies_response_json=$3, decided_at=now() 

             WHERE id=$4 AND tenant_id=$5`,

            [authStatus, JSON.stringify(bundle), responseJson, paId, tenantId]

        );

        

        return res.json({ success: result.ok, pre_auth_id: paId, auth_status: authStatus, response: result.body });

    } catch (e) { return e11Err(res, e); }

});

router.put('/api/insurance/pre-auth/:id/decision', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e11RequireTenant(req);

        const paId = e11IntId(req.params.id);

        if (!paId) return res.status(400).json({ error: 'Invalid pre-auth id' });

        const decision = String(req.body.decision || '');

        if (!['approved', 'denied', 'partial'].includes(decision)) return res.status(422).json({ error: 'Invalid decision' });

        const approvedAmount = e11Money(req.body.approved_amount) || 0;

        const authNumber = String(req.body.auth_number || '');

        await client.query('BEGIN');

        // lock the row before flipping state (race-safe)

        const cur = await client.query('SELECT id, auth_status FROM insurance_pre_authorizations WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [paId, tenantId]);

        if (!cur.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Pre-auth not found' }); }

        if (!e11Engine.canTransitionPreAuth(cur.rows[0].auth_status, decision)) {

            await client.query('ROLLBACK');

            return res.status(409).json({ error: `Invalid transition ${cur.rows[0].auth_status} -> ${decision}` });

        }

        await client.query(

            'UPDATE insurance_pre_authorizations SET auth_status=$1, approved_amount=$2, auth_number=$3, decided_at=now() WHERE id=$4 AND tenant_id=$5',

            [decision, decision === 'denied' ? 0 : approvedAmount, authNumber, paId, tenantId]);

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_PREAUTH_DECISION', 'Insurance', `PreAuth #${paId} -> ${decision}`, req.ip);

        res.json({ success: true, pre_auth_id: paId, auth_status: decision });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} return e11Err(res, e); }

    finally { client.release(); }

});

router.get('/api/insurance/claims', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_claims WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { return e11Err(res, e); }

});

router.post('/api/insurance/claims', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const patientId = e11IntId(req.body.patient_id);

        const invoiceId = e11IntId(req.body.invoice_id);

        const companyId = e11IntId(req.body.insurance_company_id);

        const claimAmount = e11Money(req.body.claim_amount) || 0;

        const patientName = String(req.body.patient_name || '');

        // L3: insurance_company is a free-text denormalized name (legacy display convenience).

        // The authoritative FK link is insurance_company_id; that column is validated below.

        // If only a name is supplied without a companyId, it is stored as-is with no FK constraint.

        const companyName = String(req.body.insurance_company || '');

        // verify referenced entities belong to this tenant (block cross-tenant claim fabrication)

        if (patientId) {

            const p = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId]);

            if (!p.rows.length) return res.status(404).json({ error: 'Patient not found' });

        }

        if (invoiceId) {

            const inv = await pool.query('SELECT id FROM invoices WHERE id=$1 AND tenant_id=$2', [invoiceId, tenantId]);

            if (!inv.rows.length) return res.status(404).json({ error: 'Invoice not found' });

        }

        if (companyId) {

            const c = await pool.query('SELECT id FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId]);

            if (!c.rows.length) return res.status(404).json({ error: 'Insurance company not found' });

        }

        // lifecycle_status forced to 'draft' + legacy status 'Pending' — NEVER from client (anti-spoof)

        const result = await pool.query(

            `INSERT INTO insurance_claims (tenant_id, patient_id, invoice_id, insurance_company_id, patient_name, insurance_company, claim_amount, status, lifecycle_status, created_by, created_at)

             VALUES ($1,$2,$3,$4,$5,$6,$7,'Pending','draft',$8, now()) RETURNING id`,

            [tenantId, patientId, invoiceId, companyId, patientName, companyName, claimAmount, req.session.user.id]);

        const claimId = result.rows[0].id;

        logAudit(req.session.user.id, req.session.user.display_name, 'CREATE_INSURANCE_CLAIM', 'Insurance', `Claim #${claimId} (invoice ${invoiceId})`, req.ip);

        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId])).rows[0]);

    } catch (e) { return e11Err(res, e); }

});

router.put('/api/insurance/claims/:id/transition', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e11RequireTenant(req);

        const claimId = e11IntId(req.params.id);

        if (!claimId) return res.status(400).json({ error: 'Invalid claim id' });

        const target = String(req.body.target || '');

        if (!e11Engine.isValidClaimState(target)) return res.status(422).json({ error: 'Invalid target state' });

        // submission to NPHIES is gated; block the submitted transition unless gate explicitly allows recording

        const approvedAmount = e11Money(req.body.approved_amount);

        const paidAmount = e11Money(req.body.paid_amount);

        const patientShare = e11Money(req.body.patient_share);

        const denialReason = String(req.body.denial_reason || '');



        await client.query('BEGIN');

        const cur = await client.query('SELECT id, lifecycle_status, claim_amount, policy_id FROM insurance_claims WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [claimId, tenantId]);

        if (!cur.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Claim not found' }); }

        const from = cur.rows[0].lifecycle_status || 'draft';

        if (!e11Engine.canTransitionClaim(from, target)) {

            await client.query('ROLLBACK');

            return res.status(409).json({ error: `Invalid transition ${from} -> ${target}` });

        }

        // map legacy status field + stamp server-authoritative amounts/timestamps per target

        let legacyStatus = null, sets = ['lifecycle_status=$1'], params = [target];

        if (target === 'submitted') { sets.push('submitted_at=now()'); }

        if (target === 'adjudicated') {

            // --- Finding 1 fix: server-side adjudication amount enforcement ---

            const claimAmount = Number(cur.rows[0].claim_amount) || 0;

            // Prefer engine-computed split from policy if resolvable

            let finalApproved = approvedAmount != null ? approvedAmount : 0;

            let finalPatientShare = patientShare != null ? patientShare : 0;

            const policyId = cur.rows[0].policy_id ? Number(cur.rows[0].policy_id) : null;

            if (policyId) {

                const pol = await client.query('SELECT co_pay_percent, co_pay_max, max_limit FROM insurance_policies WHERE id=$1', [policyId]);

                if (pol.rows.length) {

                    const engineResult = e11Engine.computePatientShare(finalApproved > 0 ? finalApproved : claimAmount, pol.rows[0]);

                    if (engineResult.status === 'OK') {

                        finalApproved = finalApproved > 0 ? finalApproved : claimAmount;

                        finalPatientShare = engineResult.patientShare;

                    }

                }

            }

            // Mandatory guards: reject client-supplied amounts that violate business invariants

            if (finalApproved < 0 || finalPatientShare < 0) {

                await client.query('ROLLBACK');

                return res.status(422).json({ error: 'Adjudication amounts must not be negative' });

            }

            if (finalApproved > claimAmount) {

                await client.query('ROLLBACK');

                return res.status(422).json({ error: `approved_amount (${finalApproved}) cannot exceed claim_amount (${claimAmount})` });

            }

            if (finalPatientShare > finalApproved) {

                await client.query('ROLLBACK');

                return res.status(422).json({ error: `patient_share (${finalPatientShare}) cannot exceed approved_amount (${finalApproved})` });

            }

            legacyStatus = 'Approved'; sets.push('adjudicated_at=now()');

            sets.push(`approved_amount=$${params.length + 1}`); params.push(finalApproved);

            sets.push(`patient_share=$${params.length + 1}`); params.push(finalPatientShare);

        }

        if (target === 'remittance_posted') {

            sets.push(`paid_amount=$${params.length + 1}`); params.push(paidAmount != null ? paidAmount : 0);

        }

        if (target === 'denied') { legacyStatus = 'Rejected'; }

        if (legacyStatus) { sets.push(`status=$${params.length + 1}`); params.push(legacyStatus); }

        params.push(claimId); params.push(tenantId);

        await client.query(

            `UPDATE insurance_claims SET ${sets.join(', ')} WHERE id=$${params.length - 1} AND tenant_id=$${params.length}`, params);

        // record denial row on transition to denied (appeal lifecycle starts 'open')

        if (target === 'denied') {

            await client.query(

                'INSERT INTO insurance_claim_denials (tenant_id, claim_id, denial_reason, appeal_status, created_by) VALUES ($1,$2,$3,$4,$5)',

                [tenantId, claimId, denialReason, 'open', req.session.user.id]);

        }

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_CLAIM_TRANSITION', 'Insurance', `Claim #${claimId} ${from} -> ${target}`, req.ip);

        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId])).rows[0]);

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} return e11Err(res, e); }

    finally { client.release(); }

});

router.put('/api/insurance/claims/:id', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e11RequireTenant(req);

        const claimId = e11IntId(req.params.id);

        if (!claimId) return res.status(400).json({ error: 'Invalid claim id' });

        const status = String(req.body.status || '');

        // translate legacy status into a lifecycle target; reject anything else

        const target = status === 'Approved' ? 'adjudicated' : status === 'Rejected' ? 'denied' : null;

        if (!target) return res.status(422).json({ error: 'Unsupported status (use /transition)' });

        await client.query('BEGIN');

        const cur = await client.query('SELECT id, lifecycle_status FROM insurance_claims WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [claimId, tenantId]);

        if (!cur.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Claim not found' }); }

        let from = cur.rows[0].lifecycle_status || 'draft';

        // legacy decision from a draft claim implies submit-then-decide; advance draft->submitted first

        if (from === 'draft' && e11Engine.canTransitionClaim('draft', 'submitted')) {

            await client.query('UPDATE insurance_claims SET lifecycle_status=$1, submitted_at=now() WHERE id=$2 AND tenant_id=$3', ['submitted', claimId, tenantId]);

            from = 'submitted';

        }

        if (!e11Engine.canTransitionClaim(from, target)) {

            await client.query('ROLLBACK');

            return res.status(409).json({ error: `Invalid transition ${from} -> ${target}` });

        }

        const legacyStatus = target === 'adjudicated' ? 'Approved' : 'Rejected';

        await client.query(

            `UPDATE insurance_claims SET lifecycle_status=$1, status=$2, ${target === 'adjudicated' ? 'adjudicated_at=now()' : 'adjudicated_at=adjudicated_at'} WHERE id=$3 AND tenant_id=$4`,

            [target, legacyStatus, claimId, tenantId]);

        if (target === 'denied') {

            await client.query('INSERT INTO insurance_claim_denials (tenant_id, claim_id, denial_reason, appeal_status, created_by) VALUES ($1,$2,$3,$4,$5)',

                [tenantId, claimId, '', 'open', req.session.user.id]);

        }

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_CLAIM_TRANSITION', 'Insurance', `Claim #${claimId} ${from} -> ${target} (legacy)`, req.ip);

        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId])).rows[0]);

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} return e11Err(res, e); }

    finally { client.release(); }

});

router.get('/api/insurance/claims/:id/lines', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const claimId = e11IntId(req.params.id);

        if (!claimId) return res.status(400).json({ error: 'Invalid claim id' });

        // ownership check via tenant-scoped claim lookup

        const c = await pool.query('SELECT id FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId]);

        if (!c.rows.length) return res.status(404).json({ error: 'Claim not found' });

        res.json((await pool.query('SELECT * FROM insurance_claim_lines WHERE claim_id=$1 AND tenant_id=$2 ORDER BY id', [claimId, tenantId])).rows);

    } catch (e) { return e11Err(res, e); }

});

router.post('/api/insurance/claims/:id/lines', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const claimId = e11IntId(req.params.id);

        if (!claimId) return res.status(400).json({ error: 'Invalid claim id' });

        const c = await pool.query('SELECT id, lifecycle_status FROM insurance_claims WHERE id=$1 AND tenant_id=$2', [claimId, tenantId]);

        if (!c.rows.length) return res.status(404).json({ error: 'Claim not found' });

        if (c.rows[0].lifecycle_status !== 'draft') return res.status(409).json({ error: 'Lines can only be added to a draft claim' });

        const serviceId = e11IntId(req.body.service_id);

        if (serviceId) {

            // Finding 3: medical_services has no tenant_id column — it is an intentionally shared/global

            // chargemaster catalog. Tenant isolation for claim lines is enforced by claim ownership above.

            const s = await pool.query('SELECT id FROM medical_services WHERE id=$1', [serviceId]);

            if (!s.rows.length) return res.status(404).json({ error: 'Service not found' });

        }

        // L2: quantity must be a positive integer (>=1); e11Money would silently coerce 0/-ve to a valid number.

        const qty = (() => { const n = Math.floor(Number(req.body.quantity)); return (Number.isFinite(n) && n >= 1) ? n : 1; })();

        const unitPrice = e11Money(req.body.unit_price) || 0;

        const lineAmount = e11Engine.round2(qty * unitPrice);

        const description = String(req.body.description || '');

        const ins = await pool.query(

            `INSERT INTO insurance_claim_lines (tenant_id, claim_id, service_id, description, quantity, unit_price, line_amount)

             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,

            [tenantId, claimId, serviceId, description, qty, unitPrice, lineAmount]);

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_CLAIM_LINE_ADD', 'Insurance', `Claim #${claimId} line #${ins.rows[0].id}`, req.ip);

        res.json({ success: true, id: ins.rows[0].id, line_amount: lineAmount });

    } catch (e) { return e11Err(res, e); }

});

router.get('/api/insurance/denials', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_claim_denials WHERE tenant_id=$1 ORDER BY id DESC LIMIT 200', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; return e11Err(res, e); }

});

router.put('/api/insurance/denials/:id/appeal', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e11RequireTenant(req);

        const denialId = e11IntId(req.params.id);

        if (!denialId) return res.status(400).json({ error: 'Invalid denial id' });

        const appealStatus = String(req.body.appeal_status || '');

        if (!['appealed', 'upheld', 'overturned', 'closed'].includes(appealStatus)) return res.status(422).json({ error: 'Invalid appeal status' });

        const notes = String(req.body.appeal_notes || '');

        await client.query('BEGIN');

        const cur = await client.query('SELECT id, claim_id, appeal_status FROM insurance_claim_denials WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [denialId, tenantId]);

        if (!cur.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Denial not found' }); }

        await client.query('UPDATE insurance_claim_denials SET appeal_status=$1, appeal_notes=$2 WHERE id=$3 AND tenant_id=$4',

            [appealStatus, notes, denialId, tenantId]);

        // Finding 2 fix: 'appealed' (appeal filed) AND 'overturned' both move the claim denied->appealed.

        // 'appealed' = appeal submitted by the provider; 'overturned' = payer reverses the denial.

        if (appealStatus === 'appealed' || appealStatus === 'overturned') {

            const claimId = cur.rows[0].claim_id;

            const claim = await client.query('SELECT lifecycle_status FROM insurance_claims WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [claimId, tenantId]);

            if (claim.rows.length && e11Engine.canTransitionClaim(claim.rows[0].lifecycle_status, 'appealed')) {

                await client.query('UPDATE insurance_claims SET lifecycle_status=$1 WHERE id=$2 AND tenant_id=$3', ['appealed', claimId, tenantId]);

            }

        }

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_DENIAL_APPEAL', 'Insurance', `Denial #${denialId} -> ${appealStatus}`, req.ip);

        res.json({ success: true, denial_id: denialId, appeal_status: appealStatus });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} return e11Err(res, e); }

    finally { client.release(); }

});

router.get('/api/insurance/payer-pricing', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        res.json((await pool.query('SELECT * FROM insurance_payer_pricing WHERE tenant_id=$1 ORDER BY id DESC LIMIT 500', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; return e11Err(res, e); }

});

router.post('/api/insurance/payer-pricing', requireAuth, requireRole(...E11_INS_ROLES), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e11RequireTenant(req);

        const companyId = e11IntId(req.body.insurance_company_id);

        const serviceId = e11IntId(req.body.service_id);

        const payerPrice = e11Money(req.body.payer_price);

        if (!companyId || !serviceId || payerPrice === null) return res.status(400).json({ error: 'company, service and payer_price required' });

        const c = await pool.query('SELECT id FROM insurance_companies WHERE id=$1 AND tenant_id=$2', [companyId, tenantId]);

        if (!c.rows.length) return res.status(404).json({ error: 'Insurance company not found' });

        // Finding 3: medical_services has no tenant_id column — intentionally shared/global chargemaster catalog.

        const s = await pool.query('SELECT id FROM medical_services WHERE id=$1', [serviceId]);

        if (!s.rows.length) return res.status(404).json({ error: 'Service not found' });

        const ins = await pool.query(

            `INSERT INTO insurance_payer_pricing (tenant_id, insurance_company_id, service_id, payer_price, created_by)

             VALUES ($1,$2,$3,$4,$5)

             ON CONFLICT (tenant_id, insurance_company_id, service_id)

             DO UPDATE SET payer_price=EXCLUDED.payer_price, is_active=1

             RETURNING id`,

            [tenantId, companyId, serviceId, payerPrice, req.session.user.id]);

        logAudit(req.session.user.id, req.session.user.display_name, 'INSURANCE_PAYER_PRICE_SET', 'Insurance', `Company #${companyId} service #${serviceId} -> ${payerPrice}`, req.ip);

        res.json({ success: true, id: ins.rows[0].id, payer_price: payerPrice });

    } catch (e) { return e11Err(res, e); }

});


    return router;
}
