const express = require('express');
const router = express.Router();
const { funcs } = require('./tier109_pain_management_571_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pain_assessment', asyncH((req, res) => { const r = f.pain_assessment(req.body || {}); res.json({ ok: true, op: 'pain_assessment', result: r }); }));
router.post('/opioid_prescribing', asyncH((req, res) => { const r = f.opioid_prescribing(req.body || {}); res.json({ ok: true, op: 'opioid_prescribing', result: r }); }));
router.post('/non_opioid_treatment', asyncH((req, res) => { const r = f.non_opioid_treatment(req.body || {}); res.json({ ok: true, op: 'non_opioid_treatment', result: r }); }));
router.post('/interventional_pain', asyncH((req, res) => { const r = f.interventional_pain(req.body || {}); res.json({ ok: true, op: 'interventional_pain', result: r }); }));
router.post('/pain_followup', asyncH((req, res) => { const r = f.pain_followup(req.body || {}); res.json({ ok: true, op: 'pain_followup', result: r }); }));
module.exports = router;
