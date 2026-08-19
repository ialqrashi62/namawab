const express = require('express');
const router = express.Router();
const { funcs } = require('./tier92_immunodeficiency_483_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/primary_immunodeficiency', asyncH((req, res) => { const r = f.primary_immunodeficiency(req.body || {}); res.json({ ok: true, op: 'primary_immunodeficiency', result: r }); }));
router.post('/hiv_care', asyncH((req, res) => { const r = f.hiv_care(req.body || {}); res.json({ ok: true, op: 'hiv_care', result: r }); }));
router.post('/immunoglobulin_replacement', asyncH((req, res) => { const r = f.immunoglobulin_replacement(req.body || {}); res.json({ ok: true, op: 'immunoglobulin_replacement', result: r }); }));
router.post('/vaccine_immunodeficiency', asyncH((req, res) => { const r = f.vaccine_immunodeficiency(req.body || {}); res.json({ ok: true, op: 'vaccine_immunodeficiency', result: r }); }));
router.post('/autoimmune_screening', asyncH((req, res) => { const r = f.autoimmune_screening(req.body || {}); res.json({ ok: true, op: 'autoimmune_screening', result: r }); }));
module.exports = router;
