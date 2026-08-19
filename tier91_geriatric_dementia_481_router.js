const express = require('express');
const router = express.Router();
const { funcs } = require('./tier91_geriatric_dementia_481_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/dementia_diagnosis', asyncH((req, res) => { const r = f.dementia_diagnosis(req.body || {}); res.json({ ok: true, op: 'dementia_diagnosis', result: r }); }));
router.post('/bpsd', asyncH((req, res) => { const r = f.bpsd(req.body || {}); res.json({ ok: true, op: 'bpsd', result: r }); }));
router.post('/dementia_medications', asyncH((req, res) => { const r = f.dementia_medications(req.body || {}); res.json({ ok: true, op: 'dementia_medications', result: r }); }));
router.post('/caregiver_support', asyncH((req, res) => { const r = f.caregiver_support(req.body || {}); res.json({ ok: true, op: 'caregiver_support', result: r }); }));
router.post('/safety_assessment', asyncH((req, res) => { const r = f.safety_assessment(req.body || {}); res.json({ ok: true, op: 'safety_assessment', result: r }); }));
module.exports = router;
