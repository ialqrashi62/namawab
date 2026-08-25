// filepath: tier14_pharm_ext_106_stewardship_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier14_pharm_ext_106_stewardship_engine');
const eps = ['abx_review','abx_iv_to_oral','opioid_stewardship','stewardship_metric','stewardship_dashboard'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
