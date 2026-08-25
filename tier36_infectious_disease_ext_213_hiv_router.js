// filepath: tier36_infectious_disease_ext_213_hiv_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier36_infectious_disease_ext_213_hiv_engine');
const eps = ['hiv_diagnosis','art_initiation','viral_load_monitoring','opportunistic_infection','hiv_prep'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
