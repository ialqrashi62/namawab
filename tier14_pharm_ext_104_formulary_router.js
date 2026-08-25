// filepath: tier14_pharm_ext_104_formulary_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier14_pharm_ext_104_formulary_engine');
const eps = ['formulary_lookup','formulary_interchange','prior_auth_check','formulary_therapeutic_class','formulary_drug_shortage'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
