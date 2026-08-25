const express = require('express');
const router = express.Router();
const { funcs } = require('./tier94_pulm_sleep_494_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/osa_assessment', asyncH((req, res) => { const r = f.osa_assessment(req.body || {}); res.json({ ok: true, op: 'osa_assessment', result: r }); }));
router.post('/cpap_titration', asyncH((req, res) => { const r = f.cpap_titration(req.body || {}); res.json({ ok: true, op: 'cpap_titration', result: r }); }));
router.post('/polysomnography', asyncH((req, res) => { const r = f.polysomnography(req.body || {}); res.json({ ok: true, op: 'polysomnography', result: r }); }));
router.post('/sleep_hygiene', asyncH((req, res) => { const r = f.sleep_hygiene(req.body || {}); res.json({ ok: true, op: 'sleep_hygiene', result: r }); }));
router.post('/narcolepsy', asyncH((req, res) => { const r = f.narcolepsy(req.body || {}); res.json({ ok: true, op: 'narcolepsy', result: r }); }));
module.exports = router;
