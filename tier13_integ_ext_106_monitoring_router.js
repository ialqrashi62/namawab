// filepath: tier13_integ_ext_106_monitoring_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier13_integ_ext_106_monitoring_engine');
const eps = ['integ_health_check','integ_sla_track','integ_circuit_breaker','integ_alert','integ_dead_letter'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
