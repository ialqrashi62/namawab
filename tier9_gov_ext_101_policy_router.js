// filepath: tier9_gov_ext_101_policy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier9_gov_ext_101_policy_engine');
const eps = ['policy_create','policy_version','policy_acknowledgment','policy_compliance','policy_retire'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
