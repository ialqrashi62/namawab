// filepath: tier36_infectious_disease_ext_214_tb_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier36_infectious_disease_ext_214_tb_engine');
const eps = ['tb_diagnosis','active_tb_treatment','latent_tb','drug_resistant_tb','tb_contact_tracing'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
