const express = require('express');
const router = express.Router();
const { funcs } = require('./tier92_allergy_clinical_484_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/allergic_rhinitis', asyncH((req, res) => { const r = f.allergic_rhinitis(req.body || {}); res.json({ ok: true, op: 'allergic_rhinitis', result: r }); }));
router.post('/asthma_management', asyncH((req, res) => { const r = f.asthma_management(req.body || {}); res.json({ ok: true, op: 'asthma_management', result: r }); }));
router.post('/food_allergy', asyncH((req, res) => { const r = f.food_allergy(req.body || {}); res.json({ ok: true, op: 'food_allergy', result: r }); }));
router.post('/drug_allergy', asyncH((req, res) => { const r = f.drug_allergy(req.body || {}); res.json({ ok: true, op: 'drug_allergy', result: r }); }));
router.post('/anaphylaxis', asyncH((req, res) => { const r = f.anaphylaxis(req.body || {}); res.json({ ok: true, op: 'anaphylaxis', result: r }); }));
module.exports = router;
