// filepath: tier21_sched_ext_141_appointment_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier21_sched_ext_141_appointment_engine');
const eps = ['appt_book','appt_conflict','appt_reschedule','appt_cancel','appt_slot_optimize'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
