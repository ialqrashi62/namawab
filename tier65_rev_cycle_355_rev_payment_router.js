// filepath: tier65_rev_cycle_355_rev_payment_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier65_rev_cycle_355_rev_payment_engine');
const eps = ['payment_posting','denial_mgmt','patient_pay','refund_processing','underpayment_recovery'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
