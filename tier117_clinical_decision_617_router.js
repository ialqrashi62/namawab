const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_clinical_decision_617_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/drug_interaction', asyncH((req, res) => { const r = f.drug_interaction(req.body || {}); res.json({ ok: true, op: 'drug_interaction', result: r }); }));
router.post('/renal_dose_alert', asyncH((req, res) => { const r = f.renal_dose_alert(req.body || {}); res.json({ ok: true, op: 'renal_dose_alert', result: r }); }));
router.post('/sepsis_alert', asyncH((req, res) => { const r = f.sepsis_alert(req.body || {}); res.json({ ok: true, op: 'sepsis_alert', result: r }); }));
router.post('/pressure_ulcer_alert', asyncH((req, res) => { const r = f.pressure_ulcer_alert(req.body || {}); res.json({ ok: true, op: 'pressure_ulcer_alert', result: r }); }));
router.post('/fall_alert', asyncH((req, res) => { const r = f.fall_alert(req.body || {}); res.json({ ok: true, op: 'fall_alert', result: r }); }));
module.exports = router;
