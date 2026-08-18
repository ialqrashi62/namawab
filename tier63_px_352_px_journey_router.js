// filepath: tier63_px_352_px_journey_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier63_px_352_px_journey_engine');
const eps = ['patient_journey_map','patient_first_impression','patient_visit_summary','patient_discharge_journey','patient_continuity_care'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
