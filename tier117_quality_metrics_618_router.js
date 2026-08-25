const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_quality_metrics_618_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/core_measure', asyncH((req, res) => { const r = f.core_measure(req.body || {}); res.json({ ok: true, op: 'core_measure', result: r }); }));
router.post('/ami_performance', asyncH((req, res) => { const r = f.ami_performance(req.body || {}); res.json({ ok: true, op: 'ami_performance', result: r }); }));
router.post('/stroke_performance', asyncH((req, res) => { const r = f.stroke_performance(req.body || {}); res.json({ ok: true, op: 'stroke_performance', result: r }); }));
router.post('/vte_performance', asyncH((req, res) => { const r = f.vte_performance(req.body || {}); res.json({ ok: true, op: 'vte_performance', result: r }); }));
router.post('/patient_satisfaction', asyncH((req, res) => { const r = f.patient_satisfaction(req.body || {}); res.json({ ok: true, op: 'patient_satisfaction', result: r }); }));
module.exports = router;
