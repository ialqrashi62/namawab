// filepath: tier7_pop_health_ext_103_cohort_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier7_pop_health_ext_103_cohort_engine');
const eps = ['cohort_identify','cohort_risk_score','cohort_outreach','cohort_engage','cohort_close_loop'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
