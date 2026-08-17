// filepath: tier43_surgery_ext_252_transplant_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier43_surgery_ext_252_transplant_engine');
const eps = ['renal_transplant','liver_transplant','heart_transplant','lung_transplant','pancreas_transplant'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
