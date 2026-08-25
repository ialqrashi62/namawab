// filepath: tier10_lab_ext_101_pathology_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier10_lab_ext_101_pathology_engine');
const eps = ['patho_specimen_accession','patho_grossing','patho_microscopic','patho_ihc','patho_frozen_section'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
