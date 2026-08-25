// filepath: tier46_pharmacy_ext_266_pharm_pain_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier46_pharmacy_ext_266_pharm_pain_engine');
const eps = ['opioid_chronic_pain','nsaid','neuropathic_pain','palliative_pain','multimodal_pain'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
