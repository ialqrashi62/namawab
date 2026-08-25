// filepath: tier60_ai_brain_ext_333_ai_clin_dec_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier60_ai_brain_ext_333_ai_clin_dec_engine');
const eps = ['clinical_decision_support','risk_stratification','differential_diagnosis','drug_interaction_ai','sepsis_alert_ai'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
