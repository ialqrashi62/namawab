const express = require('express');
const router = express.Router();
const { funcs } = require('./tier139_tri_665_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/trial_create', asyncH((req, res) => { const r = f.trial_create(req.body || {}); res.json({ ok: true, op: 'trial_create', result: r }); }));
router.post('/enroll', asyncH((req, res) => { const r = f.enroll(req.body || {}); res.json({ ok: true, op: 'enroll', result: r }); }));
router.post('/visit', asyncH((req, res) => { const r = f.visit(req.body || {}); res.json({ ok: true, op: 'visit', result: r }); }));
router.post('/ae_report', asyncH((req, res) => { const r = f.ae_report(req.body || {}); res.json({ ok: true, op: 'ae_report', result: r }); }));
router.post('/trial_outcome', asyncH((req, res) => { const r = f.trial_outcome(req.body || {}); res.json({ ok: true, op: 'trial_outcome', result: r }); }));
module.exports = router;