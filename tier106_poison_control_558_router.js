const express = require('express');
const router = express.Router();
const { funcs } = require('./tier106_poison_control_558_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/exposure_assessment', asyncH((req, res) => { const r = f.exposure_assessment(req.body || {}); res.json({ ok: true, op: 'exposure_assessment', result: r }); }));
router.post('/antidote_administration', asyncH((req, res) => { const r = f.antidote_administration(req.body || {}); res.json({ ok: true, op: 'antidote_administration', result: r }); }));
router.post('/observation_period', asyncH((req, res) => { const r = f.observation_period(req.body || {}); res.json({ ok: true, op: 'observation_period', result: r }); }));
router.post('/follow_up_call', asyncH((req, res) => { const r = f.follow_up_call(req.body || {}); res.json({ ok: true, op: 'follow_up_call', result: r }); }));
router.post('/toxicology_screen', asyncH((req, res) => { const r = f.toxicology_screen(req.body || {}); res.json({ ok: true, op: 'toxicology_screen', result: r }); }));
module.exports = router;
