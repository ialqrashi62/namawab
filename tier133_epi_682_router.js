const express = require('express');
const router = express.Router();
const { funcs } = require('./tier133_epi_682_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/incidence_rate', asyncH((req, res) => { const r = f.incidence_rate(req.body || {}); res.json({ ok: true, op: 'incidence_rate', result: r }); }));
router.post('/prevalence_study', asyncH((req, res) => { const r = f.prevalence_study(req.body || {}); res.json({ ok: true, op: 'prevalence_study', result: r }); }));
router.post('/outbreak_analysis', asyncH((req, res) => { const r = f.outbreak_analysis(req.body || {}); res.json({ ok: true, op: 'outbreak_analysis', result: r }); }));
router.post('/risk_factor', asyncH((req, res) => { const r = f.risk_factor(req.body || {}); res.json({ ok: true, op: 'risk_factor', result: r }); }));
router.post('/mortality_stats', asyncH((req, res) => { const r = f.mortality_stats(req.body || {}); res.json({ ok: true, op: 'mortality_stats', result: r }); }));
module.exports = router;