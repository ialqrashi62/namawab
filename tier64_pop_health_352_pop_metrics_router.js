// filepath: tier64_pop_health_352_pop_metrics_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier64_pop_health_352_pop_metrics_engine');
const eps = ['hEDIS_measure','quality_pay_performance','metric_trend','benchmark_comparison','intervention_roi'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
