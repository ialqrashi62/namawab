const express = require('express');
const router = express.Router();
const { funcs } = require('./tier112_stew_extended_594_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/local_antibiogram', asyncH((req, res) => { const r = f.local_antibiogram(req.body || {}); res.json({ ok: true, op: 'local_antibiogram', result: r }); }));
router.post('/antibiotic_d_drug_specific', asyncH((req, res) => { const r = f.antibiotic_d_drug_specific(req.body || {}); res.json({ ok: true, op: 'antibiotic_d_drug_specific', result: r }); }));
router.post('/resistance_trend', asyncH((req, res) => { const r = f.resistance_trend(req.body || {}); res.json({ ok: true, op: 'resistance_trend', result: r }); }));
router.post('/intervention_metrics', asyncH((req, res) => { const r = f.intervention_metrics(req.body || {}); res.json({ ok: true, op: 'intervention_metrics', result: r }); }));
router.post('/antibiogram_alert', asyncH((req, res) => { const r = f.antibiogram_alert(req.body || {}); res.json({ ok: true, op: 'antibiogram_alert', result: r }); }));
module.exports = router;
