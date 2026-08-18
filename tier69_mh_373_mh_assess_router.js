// filepath: tier69_mh_373_mh_assess_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier69_mh_373_mh_assess_engine');
const eps = ['mh_initial_intake','mh_diagnostic_interview','mh_risk_screen','mh_safety_plan','mh_functional_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
