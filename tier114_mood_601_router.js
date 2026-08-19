const express = require('express');
const router = express.Router();
const { funcs } = require('./tier114_mood_601_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/mdd', asyncH((req, res) => { const r = f.mdd(req.body || {}); res.json({ ok: true, op: 'mdd', result: r }); }));
router.post('/bipolar', asyncH((req, res) => { const r = f.bipolar(req.body || {}); res.json({ ok: true, op: 'bipolar', result: r }); }));
router.post('/dysthymia', asyncH((req, res) => { const r = f.dysthymia(req.body || {}); res.json({ ok: true, op: 'dysthymia', result: r }); }));
router.post('/seasonal_affective', asyncH((req, res) => { const r = f.seasonal_affective(req.body || {}); res.json({ ok: true, op: 'seasonal_affective', result: r }); }));
router.post('/mixed_features', asyncH((req, res) => { const r = f.mixed_features(req.body || {}); res.json({ ok: true, op: 'mixed_features', result: r }); }));
module.exports = router;
