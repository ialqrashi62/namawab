const express = require('express');
const router = express.Router();
const { funcs } = require('./tier141_hec_675_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cost_qaly', asyncH((req, res) => { const r = f.cost_qaly(req.body || {}); res.json({ ok: true, op: 'cost_qaly', result: r }); }));
router.post('/budget_impact', asyncH((req, res) => { const r = f.budget_impact(req.body || {}); res.json({ ok: true, op: 'budget_impact', result: r }); }));
router.post('/value_based', asyncH((req, res) => { const r = f.value_based(req.body || {}); res.json({ ok: true, op: 'value_based', result: r }); }));
router.post('/payor_mix', asyncH((req, res) => { const r = f.payor_mix(req.body || {}); res.json({ ok: true, op: 'payor_mix', result: r }); }));
router.post('/price_transparency', asyncH((req, res) => { const r = f.price_transparency(req.body || {}); res.json({ ok: true, op: 'price_transparency', result: r }); }));
module.exports = router;