// filepath: tier84_psych_ext_446_psych_sud_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier84_psych_ext_446_psych_sud_engine');
const eps = ['alcohol','opioid','cannabis','stimulant','dual_diagnosis'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
