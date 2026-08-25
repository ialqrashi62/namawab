const express = require('express');
const router = express.Router();
const { funcs } = require('./tier105_insurance_552_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/eligibility_check', asyncH((req, res) => { const r = f.eligibility_check(req.body || {}); res.json({ ok: true, op: 'eligibility_check', result: r }); }));
router.post('/authorization', asyncH((req, res) => { const r = f.authorization(req.body || {}); res.json({ ok: true, op: 'authorization', result: r }); }));
router.post('/benefit_verification', asyncH((req, res) => { const r = f.benefit_verification(req.body || {}); res.json({ ok: true, op: 'benefit_verification', result: r }); }));
router.post('/referral', asyncH((req, res) => { const r = f.referral(req.body || {}); res.json({ ok: true, op: 'referral', result: r }); }));
router.post('/pre_certification', asyncH((req, res) => { const r = f.pre_certification(req.body || {}); res.json({ ok: true, op: 'pre_certification', result: r }); }));
module.exports = router;
