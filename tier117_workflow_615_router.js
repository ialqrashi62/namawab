const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_workflow_615_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/order_set', asyncH((req, res) => { const r = f.order_set(req.body || {}); res.json({ ok: true, op: 'order_set', result: r }); }));
router.post('/care_pathway', asyncH((req, res) => { const r = f.care_pathway(req.body || {}); res.json({ ok: true, op: 'care_pathway', result: r }); }));
router.post('/referral_management', asyncH((req, res) => { const r = f.referral_management(req.body || {}); res.json({ ok: true, op: 'referral_management', result: r }); }));
router.post('/handoff', asyncH((req, res) => { const r = f.handoff(req.body || {}); res.json({ ok: true, op: 'handoff', result: r }); }));
router.post('/shift_report', asyncH((req, res) => { const r = f.shift_report(req.body || {}); res.json({ ok: true, op: 'shift_report', result: r }); }));
module.exports = router;
