const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_decision_support_618_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/clinical_alert', asyncH((req, res) => { const r = f.clinical_alert(req.body || {}); res.json({ ok: true, op: 'clinical_alert', result: r }); }));
router.post('/drug_interaction', asyncH((req, res) => { const r = f.drug_interaction(req.body || {}); res.json({ ok: true, op: 'drug_interaction', result: r }); }));
router.post('/preventive_care_alert', asyncH((req, res) => { const r = f.preventive_care_alert(req.body || {}); res.json({ ok: true, op: 'preventive_care_alert', result: r }); }));
router.post('/best_practice_alert', asyncH((req, res) => { const r = f.best_practice_alert(req.body || {}); res.json({ ok: true, op: 'best_practice_alert', result: r }); }));
router.post('/risk_score', asyncH((req, res) => { const r = f.risk_score(req.body || {}); res.json({ ok: true, op: 'risk_score', result: r }); }));
module.exports = router;
