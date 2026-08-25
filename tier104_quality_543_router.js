const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_quality_543_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/accreditation', asyncH((req, res) => { const r = f.accreditation(req.body || {}); res.json({ ok: true, op: 'accreditation', result: r }); }));
router.post('/cms_metrics', asyncH((req, res) => { const r = f.cms_metrics(req.body || {}); res.json({ ok: true, op: 'cms_metrics', result: r }); }));
router.post('/value_based_care', asyncH((req, res) => { const r = f.value_based_care(req.body || {}); res.json({ ok: true, op: 'value_based_care', result: r }); }));
router.post('/patient_experience', asyncH((req, res) => { const r = f.patient_experience(req.body || {}); res.json({ ok: true, op: 'patient_experience', result: r }); }));
router.post('/hospital_scorecard', asyncH((req, res) => { const r = f.hospital_scorecard(req.body || {}); res.json({ ok: true, op: 'hospital_scorecard', result: r }); }));
module.exports = router;
