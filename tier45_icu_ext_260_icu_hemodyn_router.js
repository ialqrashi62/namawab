// filepath: tier45_icu_ext_260_icu_hemodyn_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier45_icu_ext_260_icu_hemodyn_engine');
const eps = ['shock_cardiogenic','shock_distributive','shock_obstructive','vasopressor_management','inotrope_management'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
