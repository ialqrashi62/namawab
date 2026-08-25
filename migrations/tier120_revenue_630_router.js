const express = require('express');
const router = express.Router();
const { funcs } = require('./tier120_revenue_630_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/revenue_cycle_kpi', asyncH((req, res) => { const r = f.revenue_cycle_kpi(req.body || {}); res.json({ ok: true, op: 'revenue_cycle_kpi', result: r }); }));
router.post('/contract_management', asyncH((req, res) => { const r = f.contract_management(req.body || {}); res.json({ ok: true, op: 'contract_management', result: r }); }));
router.post('/payer_mix', asyncH((req, res) => { const r = f.payer_mix(req.body || {}); res.json({ ok: true, op: 'payer_mix', result: r }); }));
router.post('/underpayment', asyncH((req, res) => { const r = f.underpayment(req.body || {}); res.json({ ok: true, op: 'underpayment', result: r }); }));
router.post('/writeoff', asyncH((req, res) => { const r = f.writeoff(req.body || {}); res.json({ ok: true, op: 'writeoff', result: r }); }));
module.exports = router;
