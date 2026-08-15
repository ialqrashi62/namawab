'use strict';
/**
 * Command Center — Express Router
 * Mount: /api/cc
 */
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_2_command_center_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'command-center', version: '1.0.0', timestamp: new Date().toISOString() }));

// ===== Bed Management =====
router.get('/beds', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
  try {
    const r = await db.query(`SELECT * FROM cc_beds WHERE tenant_id = $1 ORDER BY ward, bed_number LIMIT 500`, [req.tenantId]);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/beds/availability', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.bedAvailability(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== ED Capacity =====
router.post('/ed/occupancy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.edOccupancy(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.get('/ed/queue', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const r = await db.query(`SELECT * FROM cc_ed_visits WHERE tenant_id = $1 AND status = 'waiting' ORDER BY triage_level, arrival_time LIMIT 100`, [req.tenantId]);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OR Schedule =====
router.get('/or/schedule', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
  try {
    const r = await db.query(`SELECT * FROM cc_or_schedule WHERE tenant_id = $1 AND scheduled_start >= NOW() ORDER BY scheduled_start LIMIT 50`, [req.tenantId]);
    res.json({ ok: true, count: r.rows.length, rows: r.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/or/throughput', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.orThroughput(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Patient Flow =====
router.post('/flow/bottleneck', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.patientFlowBottleneck(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== MCI Activation =====
router.post('/mci/activate', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const r = engine.mciActivation(req.body);
    if (r.mci_activated) {
      await db.query(`INSERT INTO cc_mci_events (tenant_id, event_type, mci_level, victims, severity, activated_by, notes)
                      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [req.tenantId, req.body.type || 'unknown', r.mci_level, req.body.victims, req.body.severity, req.user?.id || null, req.body.notes || null]);
    }
    res.json({ ok: true, result: r });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Staff Allocation =====
router.post('/staff/allocation', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.staffAllocation(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Equipment =====
router.post('/equipment/status', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  try { res.json({ ok: true, result: engine.equipmentStatus(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== ALOS =====
router.post('/alos', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.alos(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Wait Time =====
router.post('/wait-time', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.patientWaitTime(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Surge =====
router.post('/surge', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.surgeCapacity(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== KPI Dashboard =====
router.post('/kpi', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, result: engine.kpiDashboard(req.body) }); }
  catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

// ===== Stats =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
  try {
    const beds = await db.query(`SELECT status, COUNT(*) AS count FROM cc_beds WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
    const ed = await db.query(`SELECT status, COUNT(*) AS count FROM cc_ed_visits WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
    res.json({ ok: true, beds: beds.rows, ed_visits: ed.rows });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
