// filepath: tier21_sched_ext_140_waitlist_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier21_sched_ext_140_waitlist_engine');
const eps = ['waitlist_add','waitlist_match','waitlist_purge','noshow_track','patient_access'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
