const express = require('express');
const router = express.Router();
const { funcs } = require('./tier110_adverse_drug_reaction_583_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/reaction_reporting', asyncH((req, res) => { const r = f.reaction_reporting(req.body || {}); res.json({ ok: true, op: 'reaction_reporting', result: r }); }));
router.post('/causality_assessment', asyncH((req, res) => { const r = f.causality_assessment(req.body || {}); res.json({ ok: true, op: 'causality_assessment', result: r }); }));
router.post('/severity_grading', asyncH((req, res) => { const r = f.severity_grading(req.body || {}); res.json({ ok: true, op: 'severity_grading', result: r }); }));
router.post('/allergy_labeling', asyncH((req, res) => { const r = f.allergy_labeling(req.body || {}); res.json({ ok: true, op: 'allergy_labeling', result: r }); }));
router.post('/reporting_to_fda', asyncH((req, res) => { const r = f.reporting_to_fda(req.body || {}); res.json({ ok: true, op: 'reporting_to_fda', result: r }); }));
module.exports = router;
