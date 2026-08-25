const express = require('express');
const router = express.Router();
const { funcs } = require('./tier101_peds_cardiology_530_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/congenital_heart_disease', asyncH((req, res) => { const r = f.congenital_heart_disease(req.body || {}); res.json({ ok: true, op: 'congenital_heart_disease', result: r }); }));
router.post('/echocardiogram_peds', asyncH((req, res) => { const r = f.echocardiogram_peds(req.body || {}); res.json({ ok: true, op: 'echocardiogram_peds', result: r }); }));
router.post('/fetal_echo', asyncH((req, res) => { const r = f.fetal_echo(req.body || {}); res.json({ ok: true, op: 'fetal_echo', result: r }); }));
router.post('/peds_arrhythmia', asyncH((req, res) => { const r = f.peds_arrhythmia(req.body || {}); res.json({ ok: true, op: 'peds_arrhythmia', result: r }); }));
router.post('/chd_followup', asyncH((req, res) => { const r = f.chd_followup(req.body || {}); res.json({ ok: true, op: 'chd_followup', result: r }); }));
module.exports = router;
