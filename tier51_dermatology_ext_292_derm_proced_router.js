// filepath: tier51_dermatology_ext_292_derm_proced_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier51_dermatology_ext_292_derm_proced_engine');
const eps = ['excisional_biopsy','shave_biopsy','punch_biopsy','cryotherapy','phototherapy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
