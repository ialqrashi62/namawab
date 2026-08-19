const express = require('express');
const router = express.Router();
const { funcs } = require('./tier131_decision_support_675_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/alert_drug', asyncH((req, res) => { const r = f.alert_drug(req.body || {}); res.json({ ok: true, op: 'alert_drug', result: r }); }));
router.post('/alert_allergy', asyncH((req, res) => { const r = f.alert_allergy(req.body || {}); res.json({ ok: true, op: 'alert_allergy', result: r }); }));
router.post('/alert_renal', asyncH((req, res) => { const r = f.alert_renal(req.body || {}); res.json({ ok: true, op: 'alert_renal', result: r }); }));
router.post('/alert_sepsis', asyncH((req, res) => { const r = f.alert_sepsis(req.body || {}); res.json({ ok: true, op: 'alert_sepsis', result: r }); }));
router.post('/alert_falls', asyncH((req, res) => { const r = f.alert_falls(req.body || {}); res.json({ ok: true, op: 'alert_falls', result: r }); }));
module.exports = router;
