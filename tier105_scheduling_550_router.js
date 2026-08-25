const express = require('express');
const router = express.Router();
const { funcs } = require('./tier105_scheduling_550_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/appointment_booking', asyncH((req, res) => { const r = f.appointment_booking(req.body || {}); res.json({ ok: true, op: 'appointment_booking', result: r }); }));
router.post('/resource_allocation', asyncH((req, res) => { const r = f.resource_allocation(req.body || {}); res.json({ ok: true, op: 'resource_allocation', result: r }); }));
router.post('/waitlist', asyncH((req, res) => { const r = f.waitlist(req.body || {}); res.json({ ok: true, op: 'waitlist', result: r }); }));
router.post('/reminder', asyncH((req, res) => { const r = f.reminder(req.body || {}); res.json({ ok: true, op: 'reminder', result: r }); }));
router.post('/no_show', asyncH((req, res) => { const r = f.no_show(req.body || {}); res.json({ ok: true, op: 'no_show', result: r }); }));
module.exports = router;
