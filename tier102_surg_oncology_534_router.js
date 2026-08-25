const express = require('express');
const router = express.Router();
const { funcs } = require('./tier102_surg_oncology_534_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cancer_staging', asyncH((req, res) => { const r = f.cancer_staging(req.body || {}); res.json({ ok: true, op: 'cancer_staging', result: r }); }));
router.post('/tumor_resection', asyncH((req, res) => { const r = f.tumor_resection(req.body || {}); res.json({ ok: true, op: 'tumor_resection', result: r }); }));
router.post('/lymph_node_dissection', asyncH((req, res) => { const r = f.lymph_node_dissection(req.body || {}); res.json({ ok: true, op: 'lymph_node_dissection', result: r }); }));
router.post('/recurrent_cancer', asyncH((req, res) => { const r = f.recurrent_cancer(req.body || {}); res.json({ ok: true, op: 'recurrent_cancer', result: r }); }));
router.post('/palliative_surgery', asyncH((req, res) => { const r = f.palliative_surgery(req.body || {}); res.json({ ok: true, op: 'palliative_surgery', result: r }); }));
module.exports = router;
