const express = require('express');
const router = express.Router();
const { funcs } = require('./tier105_communication_554_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/secure_messaging', asyncH((req, res) => { const r = f.secure_messaging(req.body || {}); res.json({ ok: true, op: 'secure_messaging', result: r }); }));
router.post('/telehealth_video', asyncH((req, res) => { const r = f.telehealth_video(req.body || {}); res.json({ ok: true, op: 'telehealth_video', result: r }); }));
router.post('/patient_portal', asyncH((req, res) => { const r = f.patient_portal(req.body || {}); res.json({ ok: true, op: 'patient_portal', result: r }); }));
router.post('/care_team', asyncH((req, res) => { const r = f.care_team(req.body || {}); res.json({ ok: true, op: 'care_team', result: r }); }));
router.post('/patient_engagement', asyncH((req, res) => { const r = f.patient_engagement(req.body || {}); res.json({ ok: true, op: 'patient_engagement', result: r }); }));
module.exports = router;
