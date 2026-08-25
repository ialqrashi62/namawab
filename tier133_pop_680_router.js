const express = require('express');
const router = express.Router();
const { funcs } = require('./tier133_pop_680_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cohort_builder', asyncH((req, res) => { const r = f.cohort_builder(req.body || {}); res.json({ ok: true, op: 'cohort_builder', result: r }); }));
router.post('/risk_stratifier', asyncH((req, res) => { const r = f.risk_stratifier(req.body || {}); res.json({ ok: true, op: 'risk_stratifier', result: r }); }));
router.post('/outreach_campaign', asyncH((req, res) => { const r = f.outreach_campaign(req.body || {}); res.json({ ok: true, op: 'outreach_campaign', result: r }); }));
router.post('/social_determinants', asyncH((req, res) => { const r = f.social_determinants(req.body || {}); res.json({ ok: true, op: 'social_determinants', result: r }); }));
router.post('/health_equity', asyncH((req, res) => { const r = f.health_equity(req.body || {}); res.json({ ok: true, op: 'health_equity', result: r }); }));
module.exports = router;