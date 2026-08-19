const express = require('express');
const router = express.Router();
const { funcs } = require('./tier98_cardio_imaging_514_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/echocardiogram', asyncH((req, res) => { const r = f.echocardiogram(req.body || {}); res.json({ ok: true, op: 'echocardiogram', result: r }); }));
router.post('/cardiac_mri', asyncH((req, res) => { const r = f.cardiac_mri(req.body || {}); res.json({ ok: true, op: 'cardiac_mri', result: r }); }));
router.post('/cardiac_ct', asyncH((req, res) => { const r = f.cardiac_ct(req.body || {}); res.json({ ok: true, op: 'cardiac_ct', result: r }); }));
router.post('/stress_test', asyncH((req, res) => { const r = f.stress_test(req.body || {}); res.json({ ok: true, op: 'stress_test', result: r }); }));
router.post('/holter_monitoring', asyncH((req, res) => { const r = f.holter_monitoring(req.body || {}); res.json({ ok: true, op: 'holter_monitoring', result: r }); }));
module.exports = router;
