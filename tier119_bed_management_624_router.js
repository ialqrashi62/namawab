const express = require('express');
const router = express.Router();
const { funcs } = require('./tier119_bed_management_624_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/bed_assignment', asyncH((req, res) => { const r = f.bed_assignment(req.body || {}); res.json({ ok: true, op: 'bed_assignment', result: r }); }));
router.post('/bed_transfer', asyncH((req, res) => { const r = f.bed_transfer(req.body || {}); res.json({ ok: true, op: 'bed_transfer', result: r }); }));
router.post('/bed_cleaning', asyncH((req, res) => { const r = f.bed_cleaning(req.body || {}); res.json({ ok: true, op: 'bed_cleaning', result: r }); }));
router.post('/bed_status_update', asyncH((req, res) => { const r = f.bed_status_update(req.body || {}); res.json({ ok: true, op: 'bed_status_update', result: r }); }));
router.post('/capacity_dashboard', asyncH((req, res) => { const r = f.capacity_dashboard(req.body || {}); res.json({ ok: true, op: 'capacity_dashboard', result: r }); }));
module.exports = router;
