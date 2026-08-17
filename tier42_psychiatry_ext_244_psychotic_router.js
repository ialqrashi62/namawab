// filepath: tier42_psychiatry_ext_244_psychotic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier42_psychiatry_ext_244_psychotic_engine');
const eps = ['schizophrenia','schizoaffective','delusional_disorder','brief_psychotic','substance_induced_psychosis'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
