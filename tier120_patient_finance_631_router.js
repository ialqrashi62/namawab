const express = require('express');
const router = express.Router();
const { funcs } = require('./tier120_patient_finance_631_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/eligibility_check', asyncH((req, res) => { const r = f.eligibility_check(req.body || {}); res.json({ ok: true, op: 'eligibility_check', result: r }); }));
router.post('/prior_authorization', asyncH((req, res) => { const r = f.prior_authorization(req.body || {}); res.json({ ok: true, op: 'prior_authorization', result: r }); }));
router.post('/charity_care', asyncH((req, res) => { const r = f.charity_care(req.body || {}); res.json({ ok: true, op: 'charity_care', result: r }); }));
router.post('/payment_plan', asyncH((req, res) => { const r = f.payment_plan(req.body || {}); res.json({ ok: true, op: 'payment_plan', result: r }); }));
router.post('/patient_statement', asyncH((req, res) => { const r = f.patient_statement(req.body || {}); res.json({ ok: true, op: 'patient_statement', result: r }); }));
module.exports = router;
