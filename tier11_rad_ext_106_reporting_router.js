// filepath: tier11_rad_ext_106_reporting_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier11_rad_ext_106_reporting_engine');
const eps = ['rep_birads','rep_lungrads','rep_tirads','rep_critical_result','rep_follow_up'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
