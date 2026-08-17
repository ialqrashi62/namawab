// filepath: tier45_icu_ext_258_icu_vent_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier45_icu_ext_258_icu_vent_engine');
const eps = ['ards','weaning_protocol','prone_ventilation','ecmo_evaluation','ventilator_associated_pneumonia'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
