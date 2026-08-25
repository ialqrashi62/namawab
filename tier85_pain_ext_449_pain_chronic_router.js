// filepath: tier85_pain_ext_449_pain_chronic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier85_pain_ext_449_pain_chronic_engine');
const eps = ['chronic_pain','opioid_chronic','pain_clinic','neuropathic_pain','interventional_pain'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
