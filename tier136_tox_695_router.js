const express = require('express');
const router = express.Router();
const { funcs } = require('./tier136_tox_695_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tox_screen', asyncH((req, res) => { const r = f.tox_screen(req.body || {}); res.json({ ok: true, op: 'tox_screen', result: r }); }));
router.post('/poisoning', asyncH((req, res) => { const r = f.poisoning(req.body || {}); res.json({ ok: true, op: 'poisoning', result: r }); }));
router.post('/antidote', asyncH((req, res) => { const r = f.antidote(req.body || {}); res.json({ ok: true, op: 'antidote', result: r }); }));
router.post('/decon', asyncH((req, res) => { const r = f.decon(req.body || {}); res.json({ ok: true, op: 'decon', result: r }); }));
router.post('/tox_follow', asyncH((req, res) => { const r = f.tox_follow(req.body || {}); res.json({ ok: true, op: 'tox_follow', result: r }); }));
module.exports = router;