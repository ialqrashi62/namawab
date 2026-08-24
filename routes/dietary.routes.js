const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDietaryRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/dietary/orders', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query("SELECT * FROM diet_orders WHERE status='Active' AND tenant_id=$1 ORDER BY id DESC", [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/dietary/orders', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, notes } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const r = await pool.query('INSERT INTO diet_orders (admission_id,patient_id,patient_name,diet_type,diet_type_ar,texture,fluid,allergies,restrictions,supplements,ordered_by,meal_preferences,start_date,notes,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
            [admission_id, patient_id, patient_name, diet_type || 'Regular', diet_type_ar || 'عادي', texture || 'Normal', fluid || 'Normal', allergies, restrictions, supplements, ordered_by, meal_preferences, new Date().toISOString().split('T')[0], notes, tenantId]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/dietary/orders/:id', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { diet_type, diet_type_ar, texture, fluid, restrictions, status } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const sets = []; const vals = []; let i = 1;
        if (diet_type) { sets.push(`diet_type=$${i++}`); vals.push(diet_type); }
        if (diet_type_ar) { sets.push(`diet_type_ar=$${i++}`); vals.push(diet_type_ar); }
        if (texture) { sets.push(`texture=$${i++}`); vals.push(texture); }
        if (fluid) { sets.push(`fluid=$${i++}`); vals.push(fluid); }
        if (restrictions) { sets.push(`restrictions=$${i++}`); vals.push(restrictions); }
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        vals.push(req.params.id);
        vals.push(tenantId);
        const r = await pool.query(`UPDATE diet_orders SET ${sets.join(',')} WHERE id=$${i++} AND tenant_id=$${i}`, vals);
        if (!r.rowCount) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/dietary/meals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { order_id, patient_id, meal_type, meal_date, items, calories } = req.body;
        const { tenantId } = getRequestTenantContext(req);
        const r = await pool.query('INSERT INTO diet_meals (order_id,patient_id,meal_type,meal_date,items,calories,tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [order_id, patient_id, meal_type, meal_date || new Date().toISOString().split('T')[0], items, calories || 0, tenantId]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/dietary/meals/:id/deliver', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const r = await pool.query('UPDATE diet_meals SET delivered=1, delivered_by=$1 WHERE id=$2 AND tenant_id=$3', [req.body.delivered_by || '', req.params.id, tenantId]);
        if (!r.rowCount) return res.status(404).json({ error: 'Meal not found' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
