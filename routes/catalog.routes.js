const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCatalogRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, requireCatalogAccess }) {
    const router = express.Router();
router.get('/api/catalog/lab', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sql = `

            SELECT

                lt.id,

                lt.test_name,

                lt.category,

                lt.normal_range,

                COALESCE(o.custom_price, lt.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM lab_tests_catalog lt

            LEFT JOIN tenant_lab_test_overrides o ON lt.id = o.test_id AND o.tenant_id = $1

            ORDER BY lt.category, lt.test_name

        `;

        res.json((await pool.query(sql, [tenantId || null])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/catalog/lab/:id', requireAuth, requireCatalogAccess, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

        const { price } = req.body;

        if (price === undefined) return res.status(400).json({ error: 'Price required' });



        await pool.query(`

            INSERT INTO tenant_lab_test_overrides (tenant_id, test_id, custom_price, is_active)

            VALUES ($1, $2, $3, 1)

            ON CONFLICT (tenant_id, test_id)

            DO UPDATE SET custom_price = EXCLUDED.custom_price, updated_at = CURRENT_TIMESTAMP

        `, [tenantId, req.params.id, price]);



        const resolved = await pool.query(`

            SELECT

                lt.id,

                lt.test_name,

                lt.category,

                lt.normal_range,

                COALESCE(o.custom_price, lt.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM lab_tests_catalog lt

            LEFT JOIN tenant_lab_test_overrides o ON lt.id = o.test_id AND o.tenant_id = $1

            WHERE lt.id = $2

        `, [tenantId, req.params.id]);



        res.json(resolved.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/catalog/radiology', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const sql = `

            SELECT

                rc.id,

                rc.modality,

                rc.exact_name,

                COALESCE(o.custom_template, rc.default_template) AS default_template,

                COALESCE(o.custom_price, rc.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM radiology_catalog rc

            LEFT JOIN tenant_radiology_overrides o ON rc.id = o.radiology_id AND o.tenant_id = $1

            ORDER BY rc.modality, rc.exact_name

        `;

        res.json((await pool.query(sql, [tenantId || null])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/catalog/radiology/:id', requireAuth, requireCatalogAccess, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(400).json({ error: 'Tenant context required' });

        const { price, template } = req.body;



        if (price !== undefined) {

            await pool.query(`

                INSERT INTO tenant_radiology_overrides (tenant_id, radiology_id, custom_price, is_active)

                VALUES ($1, $2, $3, 1)

                ON CONFLICT (tenant_id, radiology_id)

                DO UPDATE SET custom_price = EXCLUDED.custom_price, updated_at = CURRENT_TIMESTAMP

            `, [tenantId, req.params.id, price]);

        }

        if (template !== undefined) {

            await pool.query(`

                INSERT INTO tenant_radiology_overrides (tenant_id, radiology_id, custom_price, custom_template, is_active)

                VALUES ($1, $2, 0, $3, 1)

                ON CONFLICT (tenant_id, radiology_id)

                DO UPDATE SET custom_template = EXCLUDED.custom_template, updated_at = CURRENT_TIMESTAMP

            `, [tenantId, req.params.id, template]);

        }



        const resolved = await pool.query(`

            SELECT

                rc.id,

                rc.modality,

                rc.exact_name,

                COALESCE(o.custom_template, rc.default_template) AS default_template,

                COALESCE(o.custom_price, rc.price) AS price,

                COALESCE(o.is_active, 1) AS is_active

            FROM radiology_catalog rc

            LEFT JOIN tenant_radiology_overrides o ON rc.id = o.radiology_id AND o.tenant_id = $1

            WHERE rc.id = $2

        `, [tenantId, req.params.id]);



        res.json(resolved.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
