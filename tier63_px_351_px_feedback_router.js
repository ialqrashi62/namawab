// filepath: tier63_px_351_px_feedback_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier63_px_351_px_feedback_engine');
const eps = ['patient_praise','patient_suggestion','patient_real_time_pulse','patient_focus_group','patient_quality_partner'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
