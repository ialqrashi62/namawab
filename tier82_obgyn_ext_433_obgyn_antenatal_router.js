// filepath: tier82_obgyn_ext_433_obgyn_antenatal_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier82_obgyn_ext_433_obgyn_antenatal_engine');
const eps = ['antenatal_initial','antenatal_followup','high_risk_preg','rhesus_isoimmunization','multiples'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
