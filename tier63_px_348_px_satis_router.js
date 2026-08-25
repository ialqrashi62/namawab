// filepath: tier63_px_348_px_satis_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier63_px_348_px_satis_engine');
const eps = ['patient_complaint_resolution','patient_satisfaction_survey','patient_testimonial','patient_loyalty','patient_advocacy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
