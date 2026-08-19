const express = require('express');
const router = express.Router();
const { funcs } = require('./tier139_wear_666_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/device_register', asyncH((req, res) => { const r = f.device_register(req.body || {}); res.json({ ok: true, op: 'device_register', result: r }); }));
router.post('/telemetry', asyncH((req, res) => { const r = f.telemetry(req.body || {}); res.json({ ok: true, op: 'telemetry', result: r }); }));
router.post('/anomaly', asyncH((req, res) => { const r = f.anomaly(req.body || {}); res.json({ ok: true, op: 'anomaly', result: r }); }));
router.post('/adherence', asyncH((req, res) => { const r = f.adherence(req.body || {}); res.json({ ok: true, op: 'adherence', result: r }); }));
router.post('/iot_alert', asyncH((req, res) => { const r = f.iot_alert(req.body || {}); res.json({ ok: true, op: 'iot_alert', result: r }); }));
module.exports = router;