// filepath: tier14_pharm_ext_101_order_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier14_pharm_ext_101_order_engine');
const eps = ['pharm_prescribe','pharm_dispense','pharm_administer','pharm_refill','pharm_discontinue'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
