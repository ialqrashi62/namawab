const express = require('express');
const router = express.Router();
const { funcs } = require('./tier114_psychotic_602_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/schizophrenia', asyncH((req, res) => { const r = f.schizophrenia(req.body || {}); res.json({ ok: true, op: 'schizophrenia', result: r }); }));
router.post('/schizoaffective', asyncH((req, res) => { const r = f.schizoaffective(req.body || {}); res.json({ ok: true, op: 'schizoaffective', result: r }); }));
router.post('/brief_psychotic', asyncH((req, res) => { const r = f.brief_psychotic(req.body || {}); res.json({ ok: true, op: 'brief_psychotic', result: r }); }));
router.post('/delusional', asyncH((req, res) => { const r = f.delusional(req.body || {}); res.json({ ok: true, op: 'delusional', result: r }); }));
router.post('/substance_induced_psychotic', asyncH((req, res) => { const r = f.substance_induced_psychotic(req.body || {}); res.json({ ok: true, op: 'substance_induced_psychotic', result: r }); }));
module.exports = router;
