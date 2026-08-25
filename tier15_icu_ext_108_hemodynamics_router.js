// filepath: tier15_icu_ext_108_hemodynamics_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier15_icu_ext_108_hemodynamics_engine');
const eps = ['icu_shock_classify','icu_fluid_responsiveness','icu_vasopressor','icu_cardiogenic','icu_septic_shock'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
