// filepath: tier15_icu_ext_110_nutrition_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier15_icu_ext_110_nutrition_engine');
const eps = ['icu_nutrition_assess','icu_enteral','icu_parenteral','icu_glycemic','icu_pressure_injury'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
