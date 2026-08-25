const express = require('express');
const router = express.Router();
const { funcs } = require('./tier139_rob_668_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/surgical_plan', asyncH((req, res) => { const r = f.surgical_plan(req.body || {}); res.json({ ok: true, op: 'surgical_plan', result: r }); }));
router.post('/instrument_track', asyncH((req, res) => { const r = f.instrument_track(req.body || {}); res.json({ ok: true, op: 'instrument_track', result: r }); }));
router.post('/ai_assist', asyncH((req, res) => { const r = f.ai_assist(req.body || {}); res.json({ ok: true, op: 'ai_assist', result: r }); }));
router.post('/motion_analyze', asyncH((req, res) => { const r = f.motion_analyze(req.body || {}); res.json({ ok: true, op: 'motion_analyze', result: r }); }));
router.post('/post_op', asyncH((req, res) => { const r = f.post_op(req.body || {}); res.json({ ok: true, op: 'post_op', result: r }); }));
module.exports = router;