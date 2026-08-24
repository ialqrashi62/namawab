const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeVendorsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/vendors', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const rows = await pool.query('SELECT * FROM vendors WHERE tenant_id=$1 ORDER BY vendor_name_ar ASC', [tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/vendors', requireAuth, requireRole('finance', 'accounts', 'inventory', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { vendor_code, vendor_name_ar, vendor_name_en, vendor_type = 'Supplier', contact_person, phone, email, address, vat_number, commercial_register, iban, bank_name, payment_terms = 30 } = req.body;

        if (!vendor_name_ar) return res.status(400).json({ error: 'vendor_name_ar required' });

        

        const code = vendor_code || `VND-${Date.now().toString(36).toUpperCase()}`;

        const r = await pool.query(

            `INSERT INTO vendors 

                (vendor_code, vendor_name_ar, vendor_name_en, vendor_type, contact_person, phone, email, address, vat_number, commercial_register, iban, bank_name, payment_terms, is_approved, approved_by, approved_at, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, TRUE, $14, NOW(), $15) RETURNING *`,

            [code, vendor_name_ar, vendor_name_en || '', vendor_type, contact_person || '', phone || '', email || '', address || '', vat_number || '', commercial_register || '', iban || '', bank_name || '', parseInt(payment_terms)||30, req.session.user.display_name, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'VENDOR_CREATE', 'Finance', `Vendor ${vendor_name_ar} created (Code: ${code})`, tid);

        res.json({ success: true, vendor: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
