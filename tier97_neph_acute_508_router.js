const express = require('express');
const router = express.Router();
const { funcs } = require('./tier97_neph_acute_508_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/aki_diagnosis', asyncH((req, res) => { const r = f.aki_diagnosis(req.body || {}); res.json({ ok: true, op: 'aki_diagnosis', result: r }); }));
router.post('/dialysis_initiation', asyncH((req, res) => { const r = f.dialysis_initiation(req.body || {}); res.json({ ok: true, op: 'dialysis_initiation', result: r }); }));
router.post('/ckd_staging', asyncH((req, res) => { const r = f.ckd_staging(req.body || {}); res.json({ ok: true, op: 'ckd_staging', result: r }); }));
router.post('/electrolyte_management', asyncH((req, res) => { const r = f.electrolyte_management(req.body || {}); res.json({ ok: true, op: 'electrolyte_management', result: r }); }));
router.post('/acid_base', asyncH((req, res) => { const r = f.acid_base(req.body || {}); res.json({ ok: true, op: 'acid_base', result: r }); }));
module.exports = router;
