const express = require('express');
const router = express.Router();
const { funcs } = require('./tier121_genomics_633_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/genetic_test', asyncH((req, res) => { const r = f.genetic_test(req.body || {}); res.json({ ok: true, op: 'genetic_test', result: r }); }));
router.post('/variant_interpretation', asyncH((req, res) => { const r = f.variant_interpretation(req.body || {}); res.json({ ok: true, op: 'variant_interpretation', result: r }); }));
router.post('/pharmacogenomics', asyncH((req, res) => { const r = f.pharmacogenomics(req.body || {}); res.json({ ok: true, op: 'pharmacogenomics', result: r }); }));
router.post('/hereditary_cancer', asyncH((req, res) => { const r = f.hereditary_cancer(req.body || {}); res.json({ ok: true, op: 'hereditary_cancer', result: r }); }));
router.post('/prenatal_screening', asyncH((req, res) => { const r = f.prenatal_screening(req.body || {}); res.json({ ok: true, op: 'prenatal_screening', result: r }); }));
module.exports = router;
