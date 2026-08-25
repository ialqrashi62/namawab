// filepath: tier32_pulmonology_ext_196_ild_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier32_pulmonology_ext_196_ild_engine');
const eps = ['ild_classification','ild_progression','antifibrotic_therapy','oxygen_ild','lung_transplant_eval'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
