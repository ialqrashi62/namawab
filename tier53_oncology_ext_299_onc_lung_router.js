// filepath: tier53_oncology_ext_299_onc_lung_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier53_oncology_ext_299_onc_lung_engine');
const eps = ['nsclc_early','nsclc_advanced','sclc_limited','sclc_extensive','mesothelioma'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
