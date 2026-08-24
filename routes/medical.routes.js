const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMedicalRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback, requireCatalogAccess }) {
    const router = express.Router();
router.get('/api/medical/records', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (patient_id) {

            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id AND p.tenant_id=$2 WHERE mr.patient_id=$1 AND mr.tenant_id=$2 ORDER BY mr.id DESC', [patient_id, tenantId])).rows);

        } else {

            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id AND p.tenant_id=$1 WHERE mr.tenant_id=$1 ORDER BY mr.id DESC', [tenantId])).rows);

        }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical/records', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes } = req.body;

        // Verify patient belongs to tenant

        const p = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!p) return res.status(404).json({ error: 'Patient not found' });



        const result = await pool.query('INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',

            [patient_id, doctor_id || 0, diagnosis || '', symptoms || '', icd10_codes || '', notes || '', tenantId]);

        res.json((await pool.query('SELECT * FROM medical_records WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical/services', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { specialty } = req.query;

        let sql, params;

        if (specialty) {

            sql = `

                SELECT

                    ms.id,

                    ms.name_en,

                    ms.name_ar,

                    ms.specialty,

                    ms.category,

                    COALESCE(o.custom_price, ms.price) AS price,

                    COALESCE(ms.is_active, 1) AS is_active

                FROM medical_services ms

                LEFT JOIN tenant_service_overrides o ON ms.id = o.service_id AND o.tenant_id = $1

                WHERE ms.specialty = $2

                ORDER BY ms.category, ms.name_en

            `;

            params = [tenantId || null, specialty];

        } else {

            sql = `

                SELECT

                    ms.id,

                    ms.name_en,

                    ms.name_ar,

                    ms.specialty,

                    ms.category,

                    COALESCE(o.custom_price, ms.price) AS price,

                    COALESCE(ms.is_active, 1) AS is_active

                FROM medical_services ms

                LEFT JOIN tenant_service_overrides o ON ms.id = o.service_id AND o.tenant_id = $1

                ORDER BY ms.specialty, ms.category, ms.name_en

            `;

            params = [tenantId || null];

        }

        res.json((await pool.query(sql, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/medical/services/:id', requireAuth, requireCatalogAccess, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

        const { price } = req.body;

        if (price === undefined) return res.status(400).json({ error: 'Price required' });



        await pool.query(`

            INSERT INTO tenant_service_overrides (tenant_id, service_id, custom_price, is_active)

            VALUES ($1, $2, $3, 1)

            ON CONFLICT (tenant_id, service_id)

            DO UPDATE SET custom_price = EXCLUDED.custom_price, updated_at = CURRENT_TIMESTAMP

        `, [tenantId, req.params.id, price]);



        const resolved = await pool.query(`

            SELECT

                ms.id,

                ms.name_en,

                ms.name_ar,

                ms.specialty,

                ms.category,

                COALESCE(o.custom_price, ms.price) AS price,

                COALESCE(ms.is_active, 1) AS is_active

            FROM medical_services ms

            LEFT JOIN tenant_service_overrides o ON ms.id = o.service_id AND o.tenant_id = $1

            WHERE ms.id = $2

        `, [tenantId, req.params.id]);



        res.json(resolved.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical/bill-procedures', requireAuth, async (req, res) => {

    try {

        const { patient_id, services } = req.body;

        if (!patient_id || !services || !services.length) return res.status(400).json({ error: 'Missing patient or services' });

        const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];

        if (!p) return res.status(404).json({ error: 'Patient not found' });

        let totalBilled = 0;

        const descriptions = [];

        for (const svc of services) {

            totalBilled += parseFloat(svc.price) || 0;

            descriptions.push(`${svc.nameEn || svc.nameAr} (${svc.price} SAR)`);

        }

        if (totalBilled > 0) {

            const vat = await calcVAT(patient_id);

            const { total: finalTotal, vatAmount } = addVAT(totalBilled, vat.rate);

            const desc = descriptions.join(' | ') + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');

            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,$6,0)',

                [patient_id, p.name_en || p.name_ar, finalTotal, vatAmount, desc, 'Consultation']);

        }

        res.json({ success: true, totalBilled, invoiceCount: 1 });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/medical/services', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const rows = (await pool.query(

            `SELECT * FROM medical_services WHERE (tenant_id=$1 OR tenant_id IS NULL) AND is_active=true ORDER BY service_name_ar ASC LIMIT 200`,

            [tenantId]

        )).rows;

        res.json(rows);

    } catch (e) {

        try {

            const { tenantId } = getRequestTenantContext(req);

            const rows = (await pool.query('SELECT * FROM services WHERE tenant_id=$1 ORDER BY name ASC LIMIT 200', [tenantId])).rows;

            res.json(rows);

        } catch { res.json([]); }

    }

});

router.get('/api/medical/certificates', requireAuth, async (req, res) => {

    try {

        const { patient_id } = req.query;

        if (patient_id) {

            res.json((await pool.query('SELECT * FROM medical_certificates WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows);

        } else {

            res.json((await pool.query('SELECT * FROM medical_certificates ORDER BY id DESC')).rows);

        }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/medical/certificates', requireAuth, async (req, res) => {

    try {

        const { patient_id, patient_name, cert_type, diagnosis, notes, start_date, end_date, days } = req.body;

        const doctorName = req.session.user.name || '';

        const doctorId = req.session.user.id || 0;

        const result = await pool.query(

            'INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',

            [patient_id, patient_name || '', doctorId, doctorName, cert_type || 'sick_leave', diagnosis || '', notes || '', start_date || '', end_date || '', days || 0]);

        res.json((await pool.query('SELECT * FROM medical_certificates WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
