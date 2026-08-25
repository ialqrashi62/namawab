const express = require('express');
const router = express.Router();
const { funcs } = require('./tier122_devices_637_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/implant_log', asyncH((req, res) => { const r = f.implant_log(req.body || {}); res.json({ ok: true, op: 'implant_log', result: r }); }));
router.post('/device_alert', asyncH((req, res) => { const r = f.device_alert(req.body || {}); res.json({ ok: true, op: 'device_alert', result: r }); }));
router.post('/wearable_sync', asyncH((req, res) => { const r = f.wearable_sync(req.body || {}); res.json({ ok: true, op: 'wearable_sync', result: r }); }));
router.post('/smart_pump', asyncH((req, res) => { const r = f.smart_pump(req.body || {}); res.json({ ok: true, op: 'smart_pump', result: r }); }));
router.post('/bedside_monitor', asyncH((req, res) => { const r = f.bedside_monitor(req.body || {}); res.json({ ok: true, op: 'bedside_monitor', result: r }); }));
module.exports = router;
