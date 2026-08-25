const express = require('express');
const router = express.Router();
const { funcs } = require('./tier90_genetics_cancer_473_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/cancer_genetic_counseling', asyncH((req, res) => { const r = f.cancer_genetic_counseling(req.body || {}); res.json({ ok: true, op: 'cancer_genetic_counseling', result: r }); }));
router.post('/brca_counseling', asyncH((req, res) => { const r = f.brca_counseling(req.body || {}); res.json({ ok: true, op: 'brca_counseling', result: r }); }));
router.post('/lynch_syndrome', asyncH((req, res) => { const r = f.lynch_syndrome(req.body || {}); res.json({ ok: true, op: 'lynch_syndrome', result: r }); }));
router.post('/prenatal_genetics', asyncH((req, res) => { const r = f.prenatal_genetics(req.body || {}); res.json({ ok: true, op: 'prenatal_genetics', result: r }); }));
router.post('/carrier_screening', asyncH((req, res) => { const r = f.carrier_screening(req.body || {}); res.json({ ok: true, op: 'carrier_screening', result: r }); }));
module.exports = router;
