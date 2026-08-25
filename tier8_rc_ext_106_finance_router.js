// filepath: tier8_rc_ext_106_finance_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier8_rc_ext_106_finance_engine');
const eps = ['finance_ar_aging','finance_dso','finance_clean_claim_rate','finance_net_yield','finance_kpi_dashboard'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
