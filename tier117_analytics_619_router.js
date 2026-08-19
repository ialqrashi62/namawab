const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_analytics_619_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/dashboard', asyncH((req, res) => { const r = f.dashboard(req.body || {}); res.json({ ok: true, op: 'dashboard', result: r }); }));
router.post('/report', asyncH((req, res) => { const r = f.report(req.body || {}); res.json({ ok: true, op: 'report', result: r }); }));
router.post('/cohort_analysis', asyncH((req, res) => { const r = f.cohort_analysis(req.body || {}); res.json({ ok: true, op: 'cohort_analysis', result: r }); }));
router.post('/outcome_tracking', asyncH((req, res) => { const r = f.outcome_tracking(req.body || {}); res.json({ ok: true, op: 'outcome_tracking', result: r }); }));
router.post('/kpi_monitoring', asyncH((req, res) => { const r = f.kpi_monitoring(req.body || {}); res.json({ ok: true, op: 'kpi_monitoring', result: r }); }));
module.exports = router;
