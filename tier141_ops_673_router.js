const express = require('express');
const router = express.Router();
const { funcs } = require('./tier141_ops_673_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/bed_assign', asyncH((req, res) => { const r = f.bed_assign(req.body || {}); res.json({ ok: true, op: 'bed_assign', result: r }); }));
router.post('/staff_assign', asyncH((req, res) => { const r = f.staff_assign(req.body || {}); res.json({ ok: true, op: 'staff_assign', result: r }); }));
router.post('/utilization', asyncH((req, res) => { const r = f.utilization(req.body || {}); res.json({ ok: true, op: 'utilization', result: r }); }));
router.post('/housekeeping', asyncH((req, res) => { const r = f.housekeeping(req.body || {}); res.json({ ok: true, op: 'housekeeping', result: r }); }));
router.post('/transport', asyncH((req, res) => { const r = f.transport(req.body || {}); res.json({ ok: true, op: 'transport', result: r }); }));
module.exports = router;