// filepath: tier66_lab_diag_362_lab_qc_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier66_lab_diag_362_lab_qc_engine');
const eps = ['calibration_verification','quality_control','proficiency_testing','equipment_maintenance','method_validation'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
