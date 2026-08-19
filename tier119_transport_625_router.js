const express = require('express');
const router = express.Router();
const { funcs } = require('./tier119_transport_625_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/transport_request', asyncH((req, res) => { const r = f.transport_request(req.body || {}); res.json({ ok: true, op: 'transport_request', result: r }); }));
router.post('/transport_completion', asyncH((req, res) => { const r = f.transport_completion(req.body || {}); res.json({ ok: true, op: 'transport_completion', result: r }); }));
router.post('/courier_service', asyncH((req, res) => { const r = f.courier_service(req.body || {}); res.json({ ok: true, op: 'courier_service', result: r }); }));
router.post('/equipment_transport', asyncH((req, res) => { const r = f.equipment_transport(req.body || {}); res.json({ ok: true, op: 'equipment_transport', result: r }); }));
router.post('/transport_dispatch', asyncH((req, res) => { const r = f.transport_dispatch(req.body || {}); res.json({ ok: true, op: 'transport_dispatch', result: r }); }));
module.exports = router;
