// filepath: tier66_lab_diag_360_lab_micro_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier66_lab_diag_360_lab_micro_engine');
const eps = ['culture_setup','gram_stain','susceptibility','organism_id','interpretation'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
