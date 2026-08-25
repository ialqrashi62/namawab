// filepath: tier25_rehab_ext_159_therapy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier25_rehab_ext_159_therapy_engine');
const eps = ['pt_plan','ot_plan','slp_plan','discharge_plan','progress'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
