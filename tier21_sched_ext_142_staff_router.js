// filepath: tier21_sched_ext_142_staff_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier21_sched_ext_142_staff_engine');
const eps = ['staff_assign_shift','staff_coverage','staff_request','staff_overtime','staff_competency'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
