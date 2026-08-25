const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeConsentRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/consent/templates', requireAuth, async (req, res) => {

    try {

        const { category } = req.query;

        let q = 'SELECT * FROM consent_form_templates WHERE is_active=1';

        const params = [];

        if (category) { q += ' AND category=$1'; params.push(category); }

        q += ' ORDER BY category, id';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/consent/templates/:id', requireAuth, async (req, res) => {

    try {

        const t = (await pool.query('SELECT * FROM consent_form_templates WHERE id=$1', [req.params.id])).rows[0];

        if (!t) return res.status(404).json({ error: 'Not found' });

        res.json(t);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/consent/sign', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { template_id, patient_id, patient_name, signature_data, witness_name, witness_signature, doctor_name, procedure_details, notes } = req.body;

        if (!signature_data) return res.status(400).json({ error: 'Signature required' });

        const tmpl = (await pool.query('SELECT * FROM consent_form_templates WHERE id=$1', [template_id])).rows[0];

        if (!tmpl) return res.status(404).json({ error: 'Template not found' });

        // IDOR: the patient must belong to the caller's tenant (patient_consents is legacy/no tenant_id,

        // so ownership is enforced against the tenant-scoped patients table).

        if (patient_id) {

            const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        }

        const result = await pool.query(

            'INSERT INTO patient_consents (template_id, patient_id, patient_name, form_type, title, signature_data, witness_name, witness_signature, doctor_name, procedure_details, notes, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',

            [template_id, patient_id, patient_name || '', tmpl.form_type, tmpl.title_ar, signature_data, witness_name || '', witness_signature || '', doctor_name || '', procedure_details || '', notes || '', req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'SIGN_CONSENT', 'Consent', tmpl.title_ar + ' - Patient: ' + patient_name, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/consent/patient/:patient_id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        // IDOR: JOIN patients with the caller's tenant so consents of another tenant's patient never leak.

        res.json((await pool.query('SELECT pc.*, cft.title_ar as template_title, cft.category FROM patient_consents pc JOIN patients p ON pc.patient_id=p.id LEFT JOIN consent_form_templates cft ON pc.template_id=cft.id WHERE pc.patient_id=$1 AND p.tenant_id=$2 ORDER BY pc.created_at DESC', [req.params.patient_id, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/consent/recent', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        // Cross-tenant leak fix: only consents whose patient belongs to the caller's tenant.

        res.json((await pool.query('SELECT pc.*, cft.title_ar as template_title, cft.category FROM patient_consents pc JOIN patients p ON pc.patient_id=p.id LEFT JOIN consent_form_templates cft ON pc.template_id=cft.id WHERE p.tenant_id=$1 ORDER BY pc.created_at DESC LIMIT 50', [tenantId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
