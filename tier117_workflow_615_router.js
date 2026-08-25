const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_workflow_615_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/handoff_sbar', asyncH((req, res) => { const r = f.handoff_sbar(req.body || {}); res.json({ ok: true, op: 'handoff_sbar', result: r }); }));
router.post('/protocol_activation', asyncH((req, res) => { const r = f.protocol_activation(req.body || {}); res.json({ ok: true, op: 'protocol_activation', result: r }); }));
router.post('/order_set', asyncH((req, res) => { const r = f.order_set(req.body || {}); res.json({ ok: true, op: 'order_set', result: r }); }));
router.post('/rounding_list', asyncH((req, res) => { const r = f.rounding_list(req.body || {}); res.json({ ok: true, op: 'rounding_list', result: r }); }));
router.post('/discharge_checklist', asyncH((req, res) => { const r = f.discharge_checklist(req.body || {}); res.json({ ok: true, op: 'discharge_checklist', result: r }); }));
module.exports = router;
