const express = require('express');
const router = express.Router();
const { funcs } = require('./tier98_cardio_acute_513_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/stemi', asyncH((req, res) => { const r = f.stemi(req.body || {}); res.json({ ok: true, op: 'stemi', result: r }); }));
router.post('/nstemi', asyncH((req, res) => { const r = f.nstemi(req.body || {}); res.json({ ok: true, op: 'nstemi', result: r }); }));
router.post('/heart_failure', asyncH((req, res) => { const r = f.heart_failure(req.body || {}); res.json({ ok: true, op: 'heart_failure', result: r }); }));
router.post('/cardiogenic_shock', asyncH((req, res) => { const r = f.cardiogenic_shock(req.body || {}); res.json({ ok: true, op: 'cardiogenic_shock', result: r }); }));
router.post('/arrhythmia_acute', asyncH((req, res) => { const r = f.arrhythmia_acute(req.body || {}); res.json({ ok: true, op: 'arrhythmia_acute', result: r }); }));
module.exports = router;
