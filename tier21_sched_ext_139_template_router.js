// filepath: tier21_sched_ext_139_template_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier21_sched_ext_139_template_engine');
const eps = ['template_create','template_apply','template_block','template_override','template_metrics'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
