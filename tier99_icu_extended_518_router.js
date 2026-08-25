const express = require('express');
const router = express.Router();
const { funcs } = require('./tier99_icu_extended_518_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/mechanical_ventilation', asyncH((req, res) => { const r = f.mechanical_ventilation(req.body || {}); res.json({ ok: true, op: 'mechanical_ventilation', result: r }); }));
router.post('/ards_management', asyncH((req, res) => { const r = f.ards_management(req.body || {}); res.json({ ok: true, op: 'ards_management', result: r }); }));
router.post('/septic_shock', asyncH((req, res) => { const r = f.septic_shock(req.body || {}); res.json({ ok: true, op: 'septic_shock', result: r }); }));
router.post('/icu_delirium', asyncH((req, res) => { const r = f.icu_delirium(req.body || {}); res.json({ ok: true, op: 'icu_delirium', result: r }); }));
router.post('/icu_nutrition', asyncH((req, res) => { const r = f.icu_nutrition(req.body || {}); res.json({ ok: true, op: 'icu_nutrition', result: r }); }));
module.exports = router;
