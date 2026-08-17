// filepath: tier44_pediatrics_ext_256_ped_endo_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier44_pediatrics_ext_256_ped_endo_engine');
const eps = ['type1_diabetes_ped','growth_hormone_deficiency','puberty_disorder','congenital_adrenal_hyp','thyroid_ped'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
