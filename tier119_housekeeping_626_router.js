const express = require('express');
const router = express.Router();
const { funcs } = require('./tier119_housekeeping_626_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/room_cleaning', asyncH((req, res) => { const r = f.room_cleaning(req.body || {}); res.json({ ok: true, op: 'room_cleaning', result: r }); }));
router.post('/linen_request', asyncH((req, res) => { const r = f.linen_request(req.body || {}); res.json({ ok: true, op: 'linen_request', result: r }); }));
router.post('/waste_disposal', asyncH((req, res) => { const r = f.waste_disposal(req.body || {}); res.json({ ok: true, op: 'waste_disposal', result: r }); }));
router.post('/pest_control', asyncH((req, res) => { const r = f.pest_control(req.body || {}); res.json({ ok: true, op: 'pest_control', result: r }); }));
router.post('/maintenance_request', asyncH((req, res) => { const r = f.maintenance_request(req.body || {}); res.json({ ok: true, op: 'maintenance_request', result: r }); }));
module.exports = router;
