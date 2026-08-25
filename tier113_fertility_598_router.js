const express = require('express');
const router = express.Router();
const { funcs } = require('./tier113_fertility_598_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/fertility_workup', asyncH((req, res) => { const r = f.fertility_workup(req.body || {}); res.json({ ok: true, op: 'fertility_workup', result: r }); }));
router.post('/ovulation_tracking', asyncH((req, res) => { const r = f.ovulation_tracking(req.body || {}); res.json({ ok: true, op: 'ovulation_tracking', result: r }); }));
router.post('/iui_cycle', asyncH((req, res) => { const r = f.iui_cycle(req.body || {}); res.json({ ok: true, op: 'iui_cycle', result: r }); }));
router.post('/embryo_transfer', asyncH((req, res) => { const r = f.embryo_transfer(req.body || {}); res.json({ ok: true, op: 'embryo_transfer', result: r }); }));
router.post('/fertility_outcome', asyncH((req, res) => { const r = f.fertility_outcome(req.body || {}); res.json({ ok: true, op: 'fertility_outcome', result: r }); }));
module.exports = router;
