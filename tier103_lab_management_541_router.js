const express = require('express');
const router = express.Router();
const { funcs } = require('./tier103_lab_management_541_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/specimen_collection', asyncH((req, res) => { const r = f.specimen_collection(req.body || {}); res.json({ ok: true, op: 'specimen_collection', result: r }); }));
router.post('/critical_value', asyncH((req, res) => { const r = f.critical_value(req.body || {}); res.json({ ok: true, op: 'critical_value', result: r }); }));
router.post('/lab_quality', asyncH((req, res) => { const r = f.lab_quality(req.body || {}); res.json({ ok: true, op: 'lab_quality', result: r }); }));
router.post('/turn_around_time', asyncH((req, res) => { const r = f.turn_around_time(req.body || {}); res.json({ ok: true, op: 'turn_around_time', result: r }); }));
router.post('/lab_error', asyncH((req, res) => { const r = f.lab_error(req.body || {}); res.json({ ok: true, op: 'lab_error', result: r }); }));
module.exports = router;
