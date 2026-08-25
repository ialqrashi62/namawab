// filepath: tier54_emergency_ext_304_er_cardio_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier54_emergency_ext_304_er_cardio_engine');
const eps = ['acs_emergent','arrhythmia_emergent','aortic_dissection','pericarditis_tamponade','pe_massive'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
