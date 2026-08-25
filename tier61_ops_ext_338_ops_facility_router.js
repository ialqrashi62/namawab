// filepath: tier61_ops_ext_338_ops_facility_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier61_ops_ext_338_ops_facility_engine');
const eps = ['facility_maintenance','housekeeping','security_log','utility_mgmt','parking_access'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
