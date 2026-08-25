const express = require('express');
const router = express.Router();
const { funcs } = require('./tier124_cardio_imaging_645_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/echo_complete', asyncH((req, res) => { const r = f.echo_complete(req.body || {}); res.json({ ok: true, op: 'echo_complete', result: r }); }));
router.post('/stress_test', asyncH((req, res) => { const r = f.stress_test(req.body || {}); res.json({ ok: true, op: 'stress_test', result: r }); }));
router.post('/cardiac_mri', asyncH((req, res) => { const r = f.cardiac_mri(req.body || {}); res.json({ ok: true, op: 'cardiac_mri', result: r }); }));
router.post('/holter', asyncH((req, res) => { const r = f.holter(req.body || {}); res.json({ ok: true, op: 'holter', result: r }); }));
router.post('/event_monitor', asyncH((req, res) => { const r = f.event_monitor(req.body || {}); res.json({ ok: true, op: 'event_monitor', result: r }); }));
module.exports = router;
