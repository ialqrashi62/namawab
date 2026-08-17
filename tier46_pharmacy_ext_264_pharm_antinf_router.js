// filepath: tier46_pharmacy_ext_264_pharm_antinf_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier46_pharmacy_ext_264_pharm_antinf_engine');
const eps = ['antibiotic_stewardship','antifungal_therapy','antiviral_therapy','antiparasitic','resistance_review'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
