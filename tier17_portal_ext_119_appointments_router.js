// filepath: tier17_portal_ext_119_appointments_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier17_portal_ext_119_appointments_engine');
const eps = ['portal_book_appt','portal_reschedule','portal_cancel','portal_checkin','portal_telehealth'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
