const express = require('express');
const router = express.Router();
const { funcs } = require('./tier106_disaster_557_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/incident_command', asyncH((req, res) => { const r = f.incident_command(req.body || {}); res.json({ ok: true, op: 'incident_command', result: r }); }));
router.post('/triage_disaster', asyncH((req, res) => { const r = f.triage_disaster(req.body || {}); res.json({ ok: true, op: 'triage_disaster', result: r }); }));
router.post('/resource_surge', asyncH((req, res) => { const r = f.resource_surge(req.body || {}); res.json({ ok: true, op: 'resource_surge', result: r }); }));
router.post('/decontamination', asyncH((req, res) => { const r = f.decontamination(req.body || {}); res.json({ ok: true, op: 'decontamination', result: r }); }));
router.post('/evacuation', asyncH((req, res) => { const r = f.evacuation(req.body || {}); res.json({ ok: true, op: 'evacuation', result: r }); }));
module.exports = router;
