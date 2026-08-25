// filepath: tier59_telemedicine_331_tele_psy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier59_telemedicine_331_tele_psy_engine');
const eps = ['tele_psychiatry_visit','tele_psychotherapy','tele_group_therapy','tele_crisis_intervention','tele_substance_counseling'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
