const express = require('express');
const router = express.Router();
const { funcs } = require('./tier110_chemotherapy_pharmacy_582_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/regimen_protocol', asyncH((req, res) => { const r = f.regimen_protocol(req.body || {}); res.json({ ok: true, op: 'regimen_protocol', result: r }); }));
router.post('/dose_calculation', asyncH((req, res) => { const r = f.dose_calculation(req.body || {}); res.json({ ok: true, op: 'dose_calculation', result: r }); }));
router.post('/premedication', asyncH((req, res) => { const r = f.premedication(req.body || {}); res.json({ ok: true, op: 'premedication', result: r }); }));
router.post('/toxicity_monitoring', asyncH((req, res) => { const r = f.toxicity_monitoring(req.body || {}); res.json({ ok: true, op: 'toxicity_monitoring', result: r }); }));
router.post('/cycle_assessment', asyncH((req, res) => { const r = f.cycle_assessment(req.body || {}); res.json({ ok: true, op: 'cycle_assessment', result: r }); }));
module.exports = router;
