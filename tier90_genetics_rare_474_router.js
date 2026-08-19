const express = require('express');
const router = express.Router();
const { funcs } = require('./tier90_genetics_rare_474_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/rare_disease_workup', asyncH((req, res) => { const r = f.rare_disease_workup(req.body || {}); res.json({ ok: true, op: 'rare_disease_workup', result: r }); }));
router.post('/whole_exome', asyncH((req, res) => { const r = f.whole_exome(req.body || {}); res.json({ ok: true, op: 'whole_exome', result: r }); }));
router.post('/metabolic_genetics', asyncH((req, res) => { const r = f.metabolic_genetics(req.body || {}); res.json({ ok: true, op: 'metabolic_genetics', result: r }); }));
router.post('/newborn_screening', asyncH((req, res) => { const r = f.newborn_screening(req.body || {}); res.json({ ok: true, op: 'newborn_screening', result: r }); }));
router.post('/pharmacogenomics', asyncH((req, res) => { const r = f.pharmacogenomics(req.body || {}); res.json({ ok: true, op: 'pharmacogenomics', result: r }); }));
module.exports = router;
