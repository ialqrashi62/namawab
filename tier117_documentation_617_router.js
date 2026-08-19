const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_documentation_617_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/clinical_note', asyncH((req, res) => { const r = f.clinical_note(req.body || {}); res.json({ ok: true, op: 'clinical_note', result: r }); }));
router.post('/discharge_summary', asyncH((req, res) => { const r = f.discharge_summary(req.body || {}); res.json({ ok: true, op: 'discharge_summary', result: r }); }));
router.post('/procedure_note', asyncH((req, res) => { const r = f.procedure_note(req.body || {}); res.json({ ok: true, op: 'procedure_note', result: r }); }));
router.post('/consultation_note', asyncH((req, res) => { const r = f.consultation_note(req.body || {}); res.json({ ok: true, op: 'consultation_note', result: r }); }));
router.post('/progress_note', asyncH((req, res) => { const r = f.progress_note(req.body || {}); res.json({ ok: true, op: 'progress_note', result: r }); }));
module.exports = router;
