// filepath: tier59_telemedicine_332_tele_admin_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier59_telemedicine_332_tele_admin_engine');
const eps = ['tele_consent_obtained','platform_audit_log','encounter_documentation_tele','billing_tele_visit','patient_satisfaction_tele'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
