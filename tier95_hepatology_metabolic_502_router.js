const express = require('express');
const router = express.Router();
const { funcs } = require('./tier95_hepatology_metabolic_502_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/nafld_assessment', asyncH((req, res) => { const r = f.nafld_assessment(req.body || {}); res.json({ ok: true, op: 'nafld_assessment', result: r }); }));
router.post('/nash_treatment', asyncH((req, res) => { const r = f.nash_treatment(req.body || {}); res.json({ ok: true, op: 'nash_treatment', result: r }); }));
router.post('/wilson_disease', asyncH((req, res) => { const r = f.wilson_disease(req.body || {}); res.json({ ok: true, op: 'wilson_disease', result: r }); }));
router.post('/hemochromatosis', asyncH((req, res) => { const r = f.hemochromatosis(req.body || {}); res.json({ ok: true, op: 'hemochromatosis', result: r }); }));
router.post('/autoimmune_hepatitis', asyncH((req, res) => { const r = f.autoimmune_hepatitis(req.body || {}); res.json({ ok: true, op: 'autoimmune_hepatitis', result: r }); }));
module.exports = router;
