const express = require('express');
const router = express.Router();
const { funcs } = require('./tier90_genetics_lab_477_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/karyotype', asyncH((req, res) => { const r = f.karyotype(req.body || {}); res.json({ ok: true, op: 'karyotype', result: r }); }));
router.post('/microarray', asyncH((req, res) => { const r = f.microarray(req.body || {}); res.json({ ok: true, op: 'microarray', result: r }); }));
router.post('/variant_interpretation', asyncH((req, res) => { const r = f.variant_interpretation(req.body || {}); res.json({ ok: true, op: 'variant_interpretation', result: r }); }));
router.post('/fish_test', asyncH((req, res) => { const r = f.fish_test(req.body || {}); res.json({ ok: true, op: 'fish_test', result: r }); }));
router.post('/methylation_test', asyncH((req, res) => { const r = f.methylation_test(req.body || {}); res.json({ ok: true, op: 'methylation_test', result: r }); }));
module.exports = router;
