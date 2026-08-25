// filepath: tier37_neurology_ext_222_neuro_musc_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier37_neurology_ext_222_neuro_musc_engine');
const eps = ['als_diagnosis','myasthenia','peripheral_neuropathy','muscular_dystrophy','autonomic_dysfunction'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
