const express = require('express');
const router = express.Router();
const { funcs } = require('./tier90_genetics_adult_475_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/family_history', asyncH((req, res) => { const r = f.family_history(req.body || {}); res.json({ ok: true, op: 'family_history', result: r }); }));
router.post('/predictive_testing', asyncH((req, res) => { const r = f.predictive_testing(req.body || {}); res.json({ ok: true, op: 'predictive_testing', result: r }); }));
router.post('/cardiovascular_genetics', asyncH((req, res) => { const r = f.cardiovascular_genetics(req.body || {}); res.json({ ok: true, op: 'cardiovascular_genetics', result: r }); }));
router.post('/neurogenetics', asyncH((req, res) => { const r = f.neurogenetics(req.body || {}); res.json({ ok: true, op: 'neurogenetics', result: r }); }));
router.post('/genetic_followup', asyncH((req, res) => { const r = f.genetic_followup(req.body || {}); res.json({ ok: true, op: 'genetic_followup', result: r }); }));
module.exports = router;
