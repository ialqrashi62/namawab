// filepath: tier48_laboratory_ext_275_lab_micro_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier48_laboratory_ext_275_lab_micro_engine');
const eps = ['blood_culture','urine_culture','sputum_culture','stool_culture','wound_culture'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
