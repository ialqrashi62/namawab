// filepath: tier62_spec_care_ext_345_sp_home_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier62_spec_care_ext_345_sp_home_engine');
const eps = ['home_health_intake','home_health_visit','home_health_discharge','wound_care_visit','infusion_visit'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
