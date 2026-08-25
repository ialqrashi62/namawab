const express = require('express');
const router = express.Router();
const { funcs } = require('./tier105_billing_extended_551_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/charge_capture', asyncH((req, res) => { const r = f.charge_capture(req.body || {}); res.json({ ok: true, op: 'charge_capture', result: r }); }));
router.post('/claim_submission', asyncH((req, res) => { const r = f.claim_submission(req.body || {}); res.json({ ok: true, op: 'claim_submission', result: r }); }));
router.post('/denial_management', asyncH((req, res) => { const r = f.denial_management(req.body || {}); res.json({ ok: true, op: 'denial_management', result: r }); }));
router.post('/payment_posting', asyncH((req, res) => { const r = f.payment_posting(req.body || {}); res.json({ ok: true, op: 'payment_posting', result: r }); }));
router.post('/patient_statement', asyncH((req, res) => { const r = f.patient_statement(req.body || {}); res.json({ ok: true, op: 'patient_statement', result: r }); }));
module.exports = router;
