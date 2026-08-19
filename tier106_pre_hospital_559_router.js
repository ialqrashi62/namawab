const express = require('express');
const router = express.Router();
const { funcs } = require('./tier106_pre_hospital_559_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/ems_dispatch', asyncH((req, res) => { const r = f.ems_dispatch(req.body || {}); res.json({ ok: true, op: 'ems_dispatch', result: r }); }));
router.post('/field_triage', asyncH((req, res) => { const r = f.field_triage(req.body || {}); res.json({ ok: true, op: 'field_triage', result: r }); }));
router.post('/transport_decision', asyncH((req, res) => { const r = f.transport_decision(req.body || {}); res.json({ ok: true, op: 'transport_decision', result: r }); }));
router.post('/pre_hospital_care', asyncH((req, res) => { const r = f.pre_hospital_care(req.body || {}); res.json({ ok: true, op: 'pre_hospital_care', result: r }); }));
router.post('/handover', asyncH((req, res) => { const r = f.handover(req.body || {}); res.json({ ok: true, op: 'handover', result: r }); }));
module.exports = router;
