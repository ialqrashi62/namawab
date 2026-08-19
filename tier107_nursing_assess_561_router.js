const express = require('express');
const router = express.Router();
const { funcs } = require('./tier107_nursing_assess_561_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/vital_signs', asyncH((req, res) => { const r = f.vital_signs(req.body || {}); res.json({ ok: true, op: 'vital_signs', result: r }); }));
router.post('/pain_assessment', asyncH((req, res) => { const r = f.pain_assessment(req.body || {}); res.json({ ok: true, op: 'pain_assessment', result: r }); }));
router.post('/fall_risk', asyncH((req, res) => { const r = f.fall_risk(req.body || {}); res.json({ ok: true, op: 'fall_risk', result: r }); }));
router.post('/braden_scale', asyncH((req, res) => { const r = f.braden_scale(req.body || {}); res.json({ ok: true, op: 'braden_scale', result: r }); }));
router.post('/nursing_diagnosis', asyncH((req, res) => { const r = f.nursing_diagnosis(req.body || {}); res.json({ ok: true, op: 'nursing_diagnosis', result: r }); }));
module.exports = router;
