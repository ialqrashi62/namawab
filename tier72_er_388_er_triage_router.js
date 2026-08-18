// filepath: tier72_er_388_er_triage_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier72_er_388_er_triage_engine');
const eps = ['rapid_medical_assessment','esi_triage','pediatric_triage','psychiatric_triage','obstetric_triage'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
