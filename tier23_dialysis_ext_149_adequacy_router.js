// filepath: tier23_dialysis_ext_149_adequacy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier23_dialysis_ext_149_adequacy_engine');
const eps = ['ktv','urr','dry_weight','session_freq','clearance'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
