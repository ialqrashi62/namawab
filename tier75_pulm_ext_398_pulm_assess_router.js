// filepath: tier75_pulm_ext_398_pulm_assess_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier75_pulm_ext_398_pulm_assess_engine');
const eps = ['spirometry','peak_flow','bronchodilator_test','arterial_blood_gas','oximetry_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
