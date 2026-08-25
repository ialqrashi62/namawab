const express = require('express');
const router = express.Router();
const { funcs } = require('./tier118_patient_experience_620_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/patient_feedback', asyncH((req, res) => { const r = f.patient_feedback(req.body || {}); res.json({ ok: true, op: 'patient_feedback', result: r }); }));
router.post('/complaint_tracking', asyncH((req, res) => { const r = f.complaint_tracking(req.body || {}); res.json({ ok: true, op: 'complaint_tracking', result: r }); }));
router.post('/patient_advocate', asyncH((req, res) => { const r = f.patient_advocate(req.body || {}); res.json({ ok: true, op: 'patient_advocate', result: r }); }));
router.post('/patient_education', asyncH((req, res) => { const r = f.patient_education(req.body || {}); res.json({ ok: true, op: 'patient_education', result: r }); }));
router.post('/family_communication', asyncH((req, res) => { const r = f.family_communication(req.body || {}); res.json({ ok: true, op: 'family_communication', result: r }); }));
module.exports = router;
