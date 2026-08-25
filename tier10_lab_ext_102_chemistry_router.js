// filepath: tier10_lab_ext_102_chemistry_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier10_lab_ext_102_chemistry_engine');
const eps = ['chem_panel_evaluate','chem_qc_review','chem_delta_check','chem_critical_value','chem_trend'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
