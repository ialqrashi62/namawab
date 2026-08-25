const express = require('express');
const router = express.Router();
const { funcs } = require('./tier93_connective_tissue_491_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/sle_diagnosis', asyncH((req, res) => { const r = f.sle_diagnosis(req.body || {}); res.json({ ok: true, op: 'sle_diagnosis', result: r }); }));
router.post('/ssc_diagnosis', asyncH((req, res) => { const r = f.ssc_diagnosis(req.body || {}); res.json({ ok: true, op: 'ssc_diagnosis', result: r }); }));
router.post('/sjs_diagnosis', asyncH((req, res) => { const r = f.sjs_diagnosis(req.body || {}); res.json({ ok: true, op: 'sjs_diagnosis', result: r }); }));
router.post('/myositis_diagnosis', asyncH((req, res) => { const r = f.myositis_diagnosis(req.body || {}); res.json({ ok: true, op: 'myositis_diagnosis', result: r }); }));
router.post('/overlap_syndromes', asyncH((req, res) => { const r = f.overlap_syndromes(req.body || {}); res.json({ ok: true, op: 'overlap_syndromes', result: r }); }));
module.exports = router;
