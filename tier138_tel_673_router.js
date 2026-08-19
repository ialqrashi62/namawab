const express = require('express');
const router = express.Router();
const { funcs } = require('./tier138_tel_673_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/start_session', asyncH((req, res) => { const r = f.start_session(req.body || {}); res.json({ ok: true, op: 'start_session', result: r }); }));
router.post('/record', asyncH((req, res) => { const r = f.record(req.body || {}); res.json({ ok: true, op: 'record', result: r }); }));
router.post('/streaming', asyncH((req, res) => { const r = f.streaming(req.body || {}); res.json({ ok: true, op: 'streaming', result: r }); }));
router.post('/vitals_stream', asyncH((req, res) => { const r = f.vitals_stream(req.body || {}); res.json({ ok: true, op: 'vitals_stream', result: r }); }));
router.post('/end_session', asyncH((req, res) => { const r = f.end_session(req.body || {}); res.json({ ok: true, op: 'end_session', result: r }); }));
module.exports = router;