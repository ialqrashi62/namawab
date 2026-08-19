const express = require('express');
const router = express.Router();
const { funcs } = require('./tier92_autoimmune_487_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/autoimmune_assessment', asyncH((req, res) => { const r = f.autoimmune_assessment(req.body || {}); res.json({ ok: true, op: 'autoimmune_assessment', result: r }); }));
router.post('/lupus_disease_activity', asyncH((req, res) => { const r = f.lupus_disease_activity(req.body || {}); res.json({ ok: true, op: 'lupus_disease_activity', result: r }); }));
router.post('/autoimmune_arthritis', asyncH((req, res) => { const r = f.autoimmune_arthritis(req.body || {}); res.json({ ok: true, op: 'autoimmune_arthritis', result: r }); }));
router.post('/vasculitis_assessment', asyncH((req, res) => { const r = f.vasculitis_assessment(req.body || {}); res.json({ ok: true, op: 'vasculitis_assessment', result: r }); }));
router.post('/connective_tissue', asyncH((req, res) => { const r = f.connective_tissue(req.body || {}); res.json({ ok: true, op: 'connective_tissue', result: r }); }));
module.exports = router;
