const express = require('express');
const router = express.Router();
const { funcs } = require('./tier114_substance_use_604_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/alcohol_use', asyncH((req, res) => { const r = f.alcohol_use(req.body || {}); res.json({ ok: true, op: 'alcohol_use', result: r }); }));
router.post('/opioid_use', asyncH((req, res) => { const r = f.opioid_use(req.body || {}); res.json({ ok: true, op: 'opioid_use', result: r }); }));
router.post('/stimulant_use', asyncH((req, res) => { const r = f.stimulant_use(req.body || {}); res.json({ ok: true, op: 'stimulant_use', result: r }); }));
router.post('/cannabis_use', asyncH((req, res) => { const r = f.cannabis_use(req.body || {}); res.json({ ok: true, op: 'cannabis_use', result: r }); }));
router.post('/sedative_use', asyncH((req, res) => { const r = f.sedative_use(req.body || {}); res.json({ ok: true, op: 'sedative_use', result: r }); }));
module.exports = router;
