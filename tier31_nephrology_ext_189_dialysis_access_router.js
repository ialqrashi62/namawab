// filepath: tier31_nephrology_ext_189_dialysis_access_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier31_nephrology_ext_189_dialysis_access_engine');
const eps = ['av_fistula','av_graft','tunneled_catheter','peritoneal_access','access_monitoring'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
