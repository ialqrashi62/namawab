const express = require('express');
const router = express.Router();
const { funcs } = require('./tier106_er_extended_555_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/triage_protocol', asyncH((req, res) => { const r = f.triage_protocol(req.body || {}); res.json({ ok: true, op: 'triage_protocol', result: r }); }));
router.post('/fast_track', asyncH((req, res) => { const r = f.fast_track(req.body || {}); res.json({ ok: true, op: 'fast_track', result: r }); }));
router.post('/critical_care', asyncH((req, res) => { const r = f.critical_care(req.body || {}); res.json({ ok: true, op: 'critical_care', result: r }); }));
router.post('/observation', asyncH((req, res) => { const r = f.observation(req.body || {}); res.json({ ok: true, op: 'observation', result: r }); }));
router.post('/discharge_planning', asyncH((req, res) => { const r = f.discharge_planning(req.body || {}); res.json({ ok: true, op: 'discharge_planning', result: r }); }));
module.exports = router;
