const express = require('express');
const router = express.Router();
const { funcs } = require('./tier135_gen_689_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/genetic_test', asyncH((req, res) => { const r = f.genetic_test(req.body || {}); res.json({ ok: true, op: 'genetic_test', result: r }); }));
router.post('/variant_call', asyncH((req, res) => { const r = f.variant_call(req.body || {}); res.json({ ok: true, op: 'variant_call', result: r }); }));
router.post('/counseling', asyncH((req, res) => { const r = f.counseling(req.body || {}); res.json({ ok: true, op: 'counseling', result: r }); }));
router.post('/family_history', asyncH((req, res) => { const r = f.family_history(req.body || {}); res.json({ ok: true, op: 'family_history', result: r }); }));
router.post('/risk_calc', asyncH((req, res) => { const r = f.risk_calc(req.body || {}); res.json({ ok: true, op: 'risk_calc', result: r }); }));
module.exports = router;