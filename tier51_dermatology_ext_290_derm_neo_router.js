// filepath: tier51_dermatology_ext_290_derm_neo_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier51_dermatology_ext_290_derm_neo_engine');
const eps = ['melanoma_skin','bcc_skin','scc_skin','lymphoma_cutaneous','kaposi'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
