const express = require('express');
const router = express.Router();
const { funcs } = require('./tier121_biomarkers_634_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/tumor_marker', asyncH((req, res) => { const r = f.tumor_marker(req.body || {}); res.json({ ok: true, op: 'tumor_marker', result: r }); }));
router.post('/cardiac_biomarker', asyncH((req, res) => { const r = f.cardiac_biomarker(req.body || {}); res.json({ ok: true, op: 'cardiac_biomarker', result: r }); }));
router.post('/inflammatory_marker', asyncH((req, res) => { const r = f.inflammatory_marker(req.body || {}); res.json({ ok: true, op: 'inflammatory_marker', result: r }); }));
router.post('/infectious_marker', asyncH((req, res) => { const r = f.infectious_marker(req.body || {}); res.json({ ok: true, op: 'infectious_marker', result: r }); }));
router.post('/allergy_panel', asyncH((req, res) => { const r = f.allergy_panel(req.body || {}); res.json({ ok: true, op: 'allergy_panel', result: r }); }));
module.exports = router;
