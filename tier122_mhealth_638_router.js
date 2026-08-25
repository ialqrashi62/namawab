const express = require('express');
const router = express.Router();
const { funcs } = require('./tier122_mhealth_638_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/patient_app', asyncH((req, res) => { const r = f.patient_app(req.body || {}); res.json({ ok: true, op: 'patient_app', result: r }); }));
router.post('/secure_message', asyncH((req, res) => { const r = f.secure_message(req.body || {}); res.json({ ok: true, op: 'secure_message', result: r }); }));
router.post('/patient_education_video', asyncH((req, res) => { const r = f.patient_education_video(req.body || {}); res.json({ ok: true, op: 'patient_education_video', result: r }); }));
router.post('/symptom_tracker', asyncH((req, res) => { const r = f.symptom_tracker(req.body || {}); res.json({ ok: true, op: 'symptom_tracker', result: r }); }));
router.post('/ai_chatbot', asyncH((req, res) => { const r = f.ai_chatbot(req.body || {}); res.json({ ok: true, op: 'ai_chatbot', result: r }); }));
module.exports = router;
