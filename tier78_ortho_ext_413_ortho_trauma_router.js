// filepath: tier78_ortho_ext_413_ortho_trauma_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier78_ortho_ext_413_ortho_trauma_engine');
const eps = ['trauma_initial','fracture_reduction','fracture_orif','soft_tissue_injury','polytrauma'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
