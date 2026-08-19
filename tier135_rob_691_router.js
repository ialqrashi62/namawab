const express = require('express');
const router = express.Router();
const { funcs } = require('./tier135_rob_691_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/preop', asyncH((req, res) => { const r = f.preop(req.body || {}); res.json({ ok: true, op: 'preop', result: r }); }));
router.post('/console', asyncH((req, res) => { const r = f.console(req.body || {}); res.json({ ok: true, op: 'console', result: r }); }));
router.post('/outcomes', asyncH((req, res) => { const r = f.outcomes(req.body || {}); res.json({ ok: true, op: 'outcomes', result: r }); }));
router.post('/training', asyncH((req, res) => { const r = f.training(req.body || {}); res.json({ ok: true, op: 'training', result: r }); }));
router.post('/complication', asyncH((req, res) => { const r = f.complication(req.body || {}); res.json({ ok: true, op: 'complication', result: r }); }));
module.exports = router;