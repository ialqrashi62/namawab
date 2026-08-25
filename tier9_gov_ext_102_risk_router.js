// filepath: tier9_gov_ext_102_risk_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier9_gov_ext_102_risk_engine');
const eps = ['risk_register','risk_assess','risk_treatment','risk_review','risk_dashboard'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
