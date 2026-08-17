// filepath: tier36_infectious_disease_ext_215_hepatitis_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier36_infectious_disease_ext_215_hepatitis_engine');
const eps = ['hepatitis_a','hepatitis_d','hepatitis_e','chronic_hepb_management','chronic_hepc_daa'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
