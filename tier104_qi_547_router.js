const express = require('express');
const router = express.Router();
const { funcs } = require('./tier104_qi_547_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/qi_project', asyncH((req, res) => { const r = f.qi_project(req.body || {}); res.json({ ok: true, op: 'qi_project', result: r }); }));
router.post('/clinical_audit', asyncH((req, res) => { const r = f.clinical_audit(req.body || {}); res.json({ ok: true, op: 'clinical_audit', result: r }); }));
router.post('/patient_safety', asyncH((req, res) => { const r = f.patient_safety(req.body || {}); res.json({ ok: true, op: 'patient_safety', result: r }); }));
router.post('/sentinel_event', asyncH((req, res) => { const r = f.sentinel_event(req.body || {}); res.json({ ok: true, op: 'sentinel_event', result: r }); }));
router.post('/quality_metrics', asyncH((req, res) => { const r = f.quality_metrics(req.body || {}); res.json({ ok: true, op: 'quality_metrics', result: r }); }));
module.exports = router;
