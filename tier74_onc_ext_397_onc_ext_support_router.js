// filepath: tier74_onc_ext_397_onc_ext_support_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier74_onc_ext_397_onc_ext_support_engine');
const eps = ['psycho_oncology_support','spiritual_care','financial_navigation_cancer','survivorship_program','caregiver_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
