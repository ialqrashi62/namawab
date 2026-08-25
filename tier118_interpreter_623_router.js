const express = require('express');
const router = express.Router();
const { funcs } = require('./tier118_interpreter_623_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/interpreter_request', asyncH((req, res) => { const r = f.interpreter_request(req.body || {}); res.json({ ok: true, op: 'interpreter_request', result: r }); }));
router.post('/translation_document', asyncH((req, res) => { const r = f.translation_document(req.body || {}); res.json({ ok: true, op: 'translation_document', result: r }); }));
router.post('/health_literacy', asyncH((req, res) => { const r = f.health_literacy(req.body || {}); res.json({ ok: true, op: 'health_literacy', result: r }); }));
router.post('/cultural_assessment', asyncH((req, res) => { const r = f.cultural_assessment(req.body || {}); res.json({ ok: true, op: 'cultural_assessment', result: r }); }));
router.post('/patient_navigator', asyncH((req, res) => { const r = f.patient_navigator(req.body || {}); res.json({ ok: true, op: 'patient_navigator', result: r }); }));
module.exports = router;
