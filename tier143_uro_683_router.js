const express = require('express');
const router = express.Router();
const { funcs } = require('./tier143_uro_683_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/psa', asyncH((req, res) => { const r = f.psa(req.body || {}); res.json({ ok: true, op: 'psa', result: r }); }));
router.post('/uroflow', asyncH((req, res) => { const r = f.uroflow(req.body || {}); res.json({ ok: true, op: 'uroflow', result: r }); }));
router.post('/biopsy', asyncH((req, res) => { const r = f.biopsy(req.body || {}); res.json({ ok: true, op: 'biopsy', result: r }); }));
router.post('/stone', asyncH((req, res) => { const r = f.stone(req.body || {}); res.json({ ok: true, op: 'stone', result: r }); }));
router.post('/urinary', asyncH((req, res) => { const r = f.urinary(req.body || {}); res.json({ ok: true, op: 'urinary', result: r }); }));
module.exports = router;