const express = require('express');
const router = express.Router();
const { funcs } = require('./tier107_nursing_med_admin_562_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/medication_administration', asyncH((req, res) => { const r = f.medication_administration(req.body || {}); res.json({ ok: true, op: 'medication_administration', result: r }); }));
router.post('/barcode_scanning', asyncH((req, res) => { const r = f.barcode_scanning(req.body || {}); res.json({ ok: true, op: 'barcode_scanning', result: r }); }));
router.post('/iv_pump_programming', asyncH((req, res) => { const r = f.iv_pump_programming(req.body || {}); res.json({ ok: true, op: 'iv_pump_programming', result: r }); }));
router.post('/double_check_medication', asyncH((req, res) => { const r = f.double_check_medication(req.body || {}); res.json({ ok: true, op: 'double_check_medication', result: r }); }));
router.post('/medication_reconciliation', asyncH((req, res) => { const r = f.medication_reconciliation(req.body || {}); res.json({ ok: true, op: 'medication_reconciliation', result: r }); }));
module.exports = router;
