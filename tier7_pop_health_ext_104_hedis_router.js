// filepath: tier7_pop_health_ext_104_hedis_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier7_pop_health_ext_104_hedis_engine');
const eps = ['hedis_diabetes_a1c','hedis_blood_pressure','hedis_cancer_screening','hedis_readmission','hedis_star_calc'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
