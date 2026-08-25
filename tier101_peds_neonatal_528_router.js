const express = require('express');
const router = express.Router();
const { funcs } = require('./tier101_peds_neonatal_528_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/nicu_admission', asyncH((req, res) => { const r = f.nicu_admission(req.body || {}); res.json({ ok: true, op: 'nicu_admission', result: r }); }));
router.post('/respiratory_distress', asyncH((req, res) => { const r = f.respiratory_distress(req.body || {}); res.json({ ok: true, op: 'respiratory_distress', result: r }); }));
router.post('/neonatal_sepsis', asyncH((req, res) => { const r = f.neonatal_sepsis(req.body || {}); res.json({ ok: true, op: 'neonatal_sepsis', result: r }); }));
router.post('/feeding_growth', asyncH((req, res) => { const r = f.feeding_growth(req.body || {}); res.json({ ok: true, op: 'feeding_growth', result: r }); }));
router.post('/neonatal_jaundice', asyncH((req, res) => { const r = f.neonatal_jaundice(req.body || {}); res.json({ ok: true, op: 'neonatal_jaundice', result: r }); }));
module.exports = router;
