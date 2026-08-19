const express = require('express');
const router = express.Router();
const { funcs } = require('./tier92_immunology_lab_485_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/allergy_testing', asyncH((req, res) => { const r = f.allergy_testing(req.body || {}); res.json({ ok: true, op: 'allergy_testing', result: r }); }));
router.post('/lymphocyte_subsets', asyncH((req, res) => { const r = f.lymphocyte_subsets(req.body || {}); res.json({ ok: true, op: 'lymphocyte_subsets', result: r }); }));
router.post('/complement_levels', asyncH((req, res) => { const r = f.complement_levels(req.body || {}); res.json({ ok: true, op: 'complement_levels', result: r }); }));
router.post('/cytokine_panel', asyncH((req, res) => { const r = f.cytokine_panel(req.body || {}); res.json({ ok: true, op: 'cytokine_panel', result: r }); }));
router.post('/neutrophil_function', asyncH((req, res) => { const r = f.neutrophil_function(req.body || {}); res.json({ ok: true, op: 'neutrophil_function', result: r }); }));
module.exports = router;
