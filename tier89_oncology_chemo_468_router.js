const express = require('express');
const router = express.Router();
const { funcs } = require('./tier89_oncology_chemo_468_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/chemotherapy_regimen', asyncH((req, res) => { const r = f.chemotherapy_regimen(req.body || {}); res.json({ ok: true, op: 'chemotherapy_regimen', result: r }); }));
router.post('/cycle_count', asyncH((req, res) => { const r = f.cycle_count(req.body || {}); res.json({ ok: true, op: 'cycle_count', result: r }); }));
router.post('/dose_intensity', asyncH((req, res) => { const r = f.dose_intensity(req.body || {}); res.json({ ok: true, op: 'dose_intensity', result: r }); }));
router.post('/toxicity_assessment', asyncH((req, res) => { const r = f.toxicity_assessment(req.body || {}); res.json({ ok: true, op: 'toxicity_assessment', result: r }); }));
router.post('/efficacy_imaging', asyncH((req, res) => { const r = f.efficacy_imaging(req.body || {}); res.json({ ok: true, op: 'efficacy_imaging', result: r }); }));
module.exports = router;
