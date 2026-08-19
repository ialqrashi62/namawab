const express = require('express');
const router = express.Router();
const { funcs } = require('./tier113_gyne_oncology_extended_599_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tumor_marker', asyncH((req, res) => { const r = f.tumor_marker(req.body || {}); res.json({ ok: true, op: 'tumor_marker', result: r }); }));
router.post('/genetic_counseling', asyncH((req, res) => { const r = f.genetic_counseling(req.body || {}); res.json({ ok: true, op: 'genetic_counseling', result: r }); }));
router.post('/chemotherapy_cyc', asyncH((req, res) => { const r = f.chemotherapy_cyc(req.body || {}); res.json({ ok: true, op: 'chemotherapy_cyc', result: r }); }));
router.post('/radiation_planning', asyncH((req, res) => { const r = f.radiation_planning(req.body || {}); res.json({ ok: true, op: 'radiation_planning', result: r }); }));
router.post('/palliative_care_onc', asyncH((req, res) => { const r = f.palliative_care_onc(req.body || {}); res.json({ ok: true, op: 'palliative_care_onc', result: r }); }));
module.exports = router;
