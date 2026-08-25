const express = require('express');
const router = express.Router();
const { funcs } = require('./tier141_sup_674_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/inventory', asyncH((req, res) => { const r = f.inventory(req.body || {}); res.json({ ok: true, op: 'inventory', result: r }); }));
router.post('/purchase_order', asyncH((req, res) => { const r = f.purchase_order(req.body || {}); res.json({ ok: true, op: 'purchase_order', result: r }); }));
router.post('/shortage', asyncH((req, res) => { const r = f.shortage(req.body || {}); res.json({ ok: true, op: 'shortage', result: r }); }));
router.post('/recall', asyncH((req, res) => { const r = f.recall(req.body || {}); res.json({ ok: true, op: 'recall', result: r }); }));
router.post('/cost_analysis', asyncH((req, res) => { const r = f.cost_analysis(req.body || {}); res.json({ ok: true, op: 'cost_analysis', result: r }); }));
module.exports = router;