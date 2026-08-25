// filepath: tier81_uro_ext_429_uro_renal_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier81_uro_ext_429_uro_renal_engine');
const eps = ['renal_stone','renal_mass','renal_failure','uti_management','prostate_biopsy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
