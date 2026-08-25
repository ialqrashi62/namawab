const express = require('express');
const router = express.Router();
const { funcs } = require('./tier116_pt_extended_610_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/manual_therapy', asyncH((req, res) => { const r = f.manual_therapy(req.body || {}); res.json({ ok: true, op: 'manual_therapy', result: r }); }));
router.post('/therapeutic_exercise', asyncH((req, res) => { const r = f.therapeutic_exercise(req.body || {}); res.json({ ok: true, op: 'therapeutic_exercise', result: r }); }));
router.post('/gait_analysis', asyncH((req, res) => { const r = f.gait_analysis(req.body || {}); res.json({ ok: true, op: 'gait_analysis', result: r }); }));
router.post('/aquatic_therapy', asyncH((req, res) => { const r = f.aquatic_therapy(req.body || {}); res.json({ ok: true, op: 'aquatic_therapy', result: r }); }));
router.post('/work_hardening', asyncH((req, res) => { const r = f.work_hardening(req.body || {}); res.json({ ok: true, op: 'work_hardening', result: r }); }));
module.exports = router;
