// filepath: tier65_rev_cycle_353_rev_charge_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier65_rev_cycle_353_rev_charge_engine');
const eps = ['charge_capture','charge_audit','charge_dashboard','charge_appeal','charge_reconciliation'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
