const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_capacity_616_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/bed_management', asyncH((req, res) => { const r = f.bed_management(req.body || {}); res.json({ ok: true, op: 'bed_management', result: r }); }));
router.post('/staff_scheduling', asyncH((req, res) => { const r = f.staff_scheduling(req.body || {}); res.json({ ok: true, op: 'staff_scheduling', result: r }); }));
router.post('/equipment_tracking', asyncH((req, res) => { const r = f.equipment_tracking(req.body || {}); res.json({ ok: true, op: 'equipment_tracking', result: r }); }));
router.post('/room_utilization', asyncH((req, res) => { const r = f.room_utilization(req.body || {}); res.json({ ok: true, op: 'room_utilization', result: r }); }));
router.post('/resource_allocation', asyncH((req, res) => { const r = f.resource_allocation(req.body || {}); res.json({ ok: true, op: 'resource_allocation', result: r }); }));
module.exports = router;
