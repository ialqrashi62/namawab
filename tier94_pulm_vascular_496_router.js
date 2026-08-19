const express = require('express');
const router = express.Router();
const { funcs } = require('./tier94_pulm_vascular_496_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/pah_diagnosis', asyncH((req, res) => { const r = f.pah_diagnosis(req.body || {}); res.json({ ok: true, op: 'pah_diagnosis', result: r }); }));
router.post('/cteph', asyncH((req, res) => { const r = f.cteph(req.body || {}); res.json({ ok: true, op: 'cteph', result: r }); }));
router.post('/pulmonary_edema', asyncH((req, res) => { const r = f.pulmonary_edema(req.body || {}); res.json({ ok: true, op: 'pulmonary_edema', result: r }); }));
router.post('/pulmonary_embolism', asyncH((req, res) => { const r = f.pulmonary_embolism(req.body || {}); res.json({ ok: true, op: 'pulmonary_embolism', result: r }); }));
router.post('/pulmonary_hypertension', asyncH((req, res) => { const r = f.pulmonary_hypertension(req.body || {}); res.json({ ok: true, op: 'pulmonary_hypertension', result: r }); }));
module.exports = router;
