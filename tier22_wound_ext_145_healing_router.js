// filepath: tier22_wound_ext_145_healing_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier22_wound_ext_145_healing_engine');
const eps = ['wound_healing_trajectory','wound_healing_target','wound_healing_failure','wound_recurrence','wound_lifestyle'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
