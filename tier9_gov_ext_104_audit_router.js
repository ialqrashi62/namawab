// filepath: tier9_gov_ext_104_audit_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier9_gov_ext_104_audit_engine');
const eps = ['audit_plan_create','audit_execute','audit_finding','audit_follow_up','audit_report'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
