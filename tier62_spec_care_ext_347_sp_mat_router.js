// filepath: tier62_spec_care_ext_347_sp_mat_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier62_spec_care_ext_347_sp_mat_engine');
const eps = ['maternity_intake','prenatal_visit','postnatal_visit','lactation_consult','high_risk_pregnancy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
