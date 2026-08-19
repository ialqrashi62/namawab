// filepath: tier77_neuro_ext_411_neuro_neuromuscular_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier77_neuro_ext_411_neuro_neuromuscular_engine');
const eps = ['neuropathy_workup','myasthenia_gravis','als_management','gbs_assessment','cnm_referral'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
