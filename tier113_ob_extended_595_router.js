const express = require('express');
const router = express.Router();
const { funcs } = require('./tier113_ob_extended_595_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/lactation_consult', asyncH((req, res) => { const r = f.lactation_consult(req.body || {}); res.json({ ok: true, op: 'lactation_consult', result: r }); }));
router.post('/breastfeeding_assessment', asyncH((req, res) => { const r = f.breastfeeding_assessment(req.body || {}); res.json({ ok: true, op: 'breastfeeding_assessment', result: r }); }));
router.post('/nipple_pain', asyncH((req, res) => { const r = f.nipple_pain(req.body || {}); res.json({ ok: true, op: 'nipple_pain', result: r }); }));
router.post('/mastitis', asyncH((req, res) => { const r = f.mastitis(req.body || {}); res.json({ ok: true, op: 'mastitis', result: r }); }));
router.post('/low_milk_supply', asyncH((req, res) => { const r = f.low_milk_supply(req.body || {}); res.json({ ok: true, op: 'low_milk_supply', result: r }); }));
module.exports = router;
