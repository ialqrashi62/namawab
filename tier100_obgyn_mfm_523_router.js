const express = require('express');
const router = express.Router();
const { funcs } = require('./tier100_obgyn_mfm_523_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/prenatal_visit', asyncH((req, res) => { const r = f.prenatal_visit(req.body || {}); res.json({ ok: true, op: 'prenatal_visit', result: r }); }));
router.post('/high_risk_pregnancy', asyncH((req, res) => { const r = f.high_risk_pregnancy(req.body || {}); res.json({ ok: true, op: 'high_risk_pregnancy', result: r }); }));
router.post('/preeclampsia', asyncH((req, res) => { const r = f.preeclampsia(req.body || {}); res.json({ ok: true, op: 'preeclampsia', result: r }); }));
router.post('/gestational_diabetes_mgmt', asyncH((req, res) => { const r = f.gestational_diabetes_mgmt(req.body || {}); res.json({ ok: true, op: 'gestational_diabetes_mgmt', result: r }); }));
router.post('/delivery_summary', asyncH((req, res) => { const r = f.delivery_summary(req.body || {}); res.json({ ok: true, op: 'delivery_summary', result: r }); }));
module.exports = router;
