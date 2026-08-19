const express = require('express');
const router = express.Router();
const { funcs } = require('./tier139_claim_667_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/claim_submit', asyncH((req, res) => { const r = f.claim_submit(req.body || {}); res.json({ ok: true, op: 'claim_submit', result: r }); }));
router.post('/claim_adjudicate', asyncH((req, res) => { const r = f.claim_adjudicate(req.body || {}); res.json({ ok: true, op: 'claim_adjudicate', result: r }); }));
router.post('/fraud_score', asyncH((req, res) => { const r = f.fraud_score(req.body || {}); res.json({ ok: true, op: 'fraud_score', result: r }); }));
router.post('/denial_appeal', asyncH((req, res) => { const r = f.denial_appeal(req.body || {}); res.json({ ok: true, op: 'denial_appeal', result: r }); }));
router.post('/remittance', asyncH((req, res) => { const r = f.remittance(req.body || {}); res.json({ ok: true, op: 'remittance', result: r }); }));
module.exports = router;