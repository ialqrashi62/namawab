const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMaintenanceRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/maintenance/work-orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM maintenance_work_orders ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/maintenance/work-orders', requireAuth, async (req, res) => {
    try {
        const { wo_number, request_type, priority, department, location, equipment_id, description, description_ar, requested_by, assigned_to, scheduled_date } = req.body;
        const num = wo_number || `WO-${Date.now().toString().slice(-6)}`;
        const r = await pool.query('INSERT INTO maintenance_work_orders (wo_number,request_type,priority,department,location,equipment_id,description,description_ar,requested_by,assigned_to,scheduled_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [num, request_type || 'Corrective', priority || 'Normal', department, location, equipment_id || 0, description, description_ar, requested_by, assigned_to, scheduled_date]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/maintenance/work-orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, assigned_to, resolution, cost } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Completed') { sets.push(`completed_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); } }
        if (assigned_to) { sets.push(`assigned_to=$${i++}`); vals.push(assigned_to); }
        if (resolution) { sets.push(`resolution=$${i++}`); vals.push(resolution); }
        if (cost !== undefined) { sets.push(`cost=$${i++}`); vals.push(cost); }
        vals.push(req.params.id);
        await pool.query(`UPDATE maintenance_work_orders SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/maintenance/equipment', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM maintenance_equipment ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/maintenance/equipment', requireAuth, async (req, res) => {
    try {
        const { equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end } = req.body;
        const r = await pool.query('INSERT INTO maintenance_equipment (equipment_name,equipment_name_ar,equipment_code,category,manufacturer,model,serial_number,department,location,purchase_date,warranty_end) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/maintenance/pm-schedules', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT p.*, e.equipment_name, e.equipment_name_ar FROM maintenance_pm_schedules p LEFT JOIN maintenance_equipment e ON p.equipment_id=e.id ORDER BY p.next_due')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/maintenance/pm-schedules', requireAuth, async (req, res) => {
    try {
        const { equipment_id, pm_type, frequency, next_due, checklist } = req.body;
        const r = await pool.query('INSERT INTO maintenance_pm_schedules (equipment_id,pm_type,frequency,next_due,checklist) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [equipment_id, pm_type, frequency || 'Monthly', next_due, checklist]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/maintenance/stats', requireAuth, async (req, res) => {
    try {
        const open = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_work_orders WHERE status='Open'")).rows[0].cnt;
        const inProg = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_work_orders WHERE status='In Progress'")).rows[0].cnt;
        const overdue = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_pm_schedules WHERE next_due < CURRENT_DATE::text AND status='Pending'")).rows[0].cnt;
        const totalEquip = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_equipment WHERE status='Active'")).rows[0].cnt;
        res.json({ openWO: open, inProgressWO: inProg, overduePM: overdue, totalEquipment: totalEquip });
    } catch (e) {
        console.error('Maintenance stats error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/api/maintenance/orders', requireAuth, async (req, res) => {
    try {
        // maintenance_orders schema provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler
        res.json((await pool.query('SELECT * FROM maintenance_orders ORDER BY created_at DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/maintenance/orders', requireAuth, async (req, res) => {
    try {
        const { equipment, location, maintenance_type, priority, description, requested_by, status } = req.body;
        const r = await pool.query('INSERT INTO maintenance_orders (equipment,location,maintenance_type,priority,description,requested_by,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [equipment, location, maintenance_type, priority, description, requested_by, status || 'pending']);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/maintenance/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const r = await pool.query('UPDATE maintenance_orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/maintenance/calibrations', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const r = await pool.query('SELECT * FROM device_calibrations WHERE tenant_id=$1 ORDER BY id DESC', [tenantId]);
        res.json(r.rows);
    } catch (e) {
        console.error('[CALIBRATIONS GET]', e.message);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/api/maintenance/calibrations', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes } = req.body;
        if (!device_name) return res.status(422).json({ error: 'device_name is required' });

        const r = await pool.query(
            `INSERT INTO device_calibrations (device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [device_name, serial_number || '', calibration_date || '', next_calibration_date || '', calibrated_by || '', status || 'Calibrated', notes || '', tenantId]
        );
        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_DEVICE_CALIBRATION', 'Maintenance',
            `Calibrated device ${device_name} (#${r.rows[0].id})`, req.ip);
        res.json(r.rows[0]);
    } catch (e) {
        console.error('[CALIBRATIONS POST]', e.message);
        res.status(500).json({ error: 'Server error' });
    }
});

    return router;
}
