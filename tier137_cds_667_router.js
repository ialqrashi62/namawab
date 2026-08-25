const express = require('express');
const router = express.Router();
const { funcs } = require('./tier137_cds_667_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/differential_dx', asyncH((req, res) => { const r = f.differential_dx(req.body || {}); res.json({ ok: true, op: 'differential_dx', result: r }); }));
router.post('/risk_score', asyncH((req, res) => { const r = f.risk_score(req.body || {}); res.json({ ok: true, op: 'risk_score', result: r }); }));
router.post('/drug_interaction', asyncH((req, res) => { const r = f.drug_interaction(req.body || {}); res.json({ ok: true, op: 'drug_interaction', result: r }); }));
router.post('/sepsis_alert', asyncH((req, res) => { const r = f.sepsis_alert(req.body || {}); res.json({ ok: true, op: 'sepsis_alert', result: r }); }));
router.post('/alert_fatigue', asyncH((req, res) => { const r = f.alert_fatigue(req.body || {}); res.json({ ok: true, op: 'alert_fatigue', result: r }); }));
module.exports = router;