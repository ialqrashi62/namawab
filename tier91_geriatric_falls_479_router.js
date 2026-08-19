const express = require('express');
const router = express.Router();
const { funcs } = require('./tier91_geriatric_falls_479_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/fall_risk', asyncH((req, res) => { const r = f.fall_risk(req.body || {}); res.json({ ok: true, op: 'fall_risk', result: r }); }));
router.post('/home_safety', asyncH((req, res) => { const r = f.home_safety(req.body || {}); res.json({ ok: true, op: 'home_safety', result: r }); }));
router.post('/balance_training', asyncH((req, res) => { const r = f.balance_training(req.body || {}); res.json({ ok: true, op: 'balance_training', result: r }); }));
router.post('/post_fall', asyncH((req, res) => { const r = f.post_fall(req.body || {}); res.json({ ok: true, op: 'post_fall', result: r }); }));
router.post('/fall_prevention', asyncH((req, res) => { const r = f.fall_prevention(req.body || {}); res.json({ ok: true, op: 'fall_prevention', result: r }); }));
module.exports = router;
