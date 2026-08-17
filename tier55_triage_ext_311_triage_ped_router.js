// filepath: tier55_triage_ext_311_triage_ped_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier55_triage_ext_311_triage_ped_engine');
const eps = ['ped_assessment_triangle','ped_color_breath_circulation','ped_illness_severity','ped_pain_assessment','ped_growth_review'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
