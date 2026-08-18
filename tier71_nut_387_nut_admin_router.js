// filepath: tier71_nut_387_nut_admin_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier71_nut_387_nut_admin_engine');
const eps = ['tpn_compounding','formula_room','diet_office_orders','food_service_isolation','catering_therapeutic'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
