const express = require('express');
const router = express.Router();
const { funcs } = require('./tier110_medication_safety_584_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/high_alert_medication', asyncH((req, res) => { const r = f.high_alert_medication(req.body || {}); res.json({ ok: true, op: 'high_alert_medication', result: r }); }));
router.post('/look_alike_sound_alike', asyncH((req, res) => { const r = f.look_alike_sound_alike(req.body || {}); res.json({ ok: true, op: 'look_alike_sound_alike', result: r }); }));
router.post('/double_check', asyncH((req, res) => { const r = f.double_check(req.body || {}); res.json({ ok: true, op: 'double_check', result: r }); }));
router.post('/cis', asyncH((req, res) => { const r = f.cis(req.body || {}); res.json({ ok: true, op: 'cis', result: r }); }));
router.post('/smart_pump', asyncH((req, res) => { const r = f.smart_pump(req.body || {}); res.json({ ok: true, op: 'smart_pump', result: r }); }));
module.exports = router;
