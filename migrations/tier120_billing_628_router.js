const express = require('express');
const router = express.Router();
const { funcs } = require('./tier120_billing_628_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/claim_submission', asyncH((req, res) => { const r = f.claim_submission(req.body || {}); res.json({ ok: true, op: 'claim_submission', result: r }); }));
router.post('/claim_status', asyncH((req, res) => { const r = f.claim_status(req.body || {}); res.json({ ok: true, op: 'claim_status', result: r }); }));
router.post('/payment_posting', asyncH((req, res) => { const r = f.payment_posting(req.body || {}); res.json({ ok: true, op: 'payment_posting', result: r }); }));
router.post('/denial_management', asyncH((req, res) => { const r = f.denial_management(req.body || {}); res.json({ ok: true, op: 'denial_management', result: r }); }));
router.post('/statement_generation', asyncH((req, res) => { const r = f.statement_generation(req.body || {}); res.json({ ok: true, op: 'statement_generation', result: r }); }));
module.exports = router;
