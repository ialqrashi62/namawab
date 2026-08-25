// filepath: tier56_surgical_specialties_316_surg_ent_surg_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier56_surgical_specialties_316_surg_ent_surg_engine');
const eps = ['thyroidectomy','parathyroidectomy','neck_dissection','tonsillectomy_bleeding','sinus_surgery'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
