const express = require('express');
const router = express.Router();
const { funcs } = require('./tier99_ed_extended_519_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ed_triage', asyncH((req, res) => { const r = f.ed_triage(req.body || {}); res.json({ ok: true, op: 'ed_triage', result: r }); }));
router.post('/trauma_assessment', asyncH((req, res) => { const r = f.trauma_assessment(req.body || {}); res.json({ ok: true, op: 'trauma_assessment', result: r }); }));
router.post('/stroke_alert', asyncH((req, res) => { const r = f.stroke_alert(req.body || {}); res.json({ ok: true, op: 'stroke_alert', result: r }); }));
router.post('/overdose_toxicology', asyncH((req, res) => { const r = f.overdose_toxicology(req.body || {}); res.json({ ok: true, op: 'overdose_toxicology', result: r }); }));
router.post('/ed_discharge', asyncH((req, res) => { const r = f.ed_discharge(req.body || {}); res.json({ ok: true, op: 'ed_discharge', result: r }); }));
module.exports = router;
