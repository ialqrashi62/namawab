// filepath: tier19_him_ext_127_coding_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier19_him_ext_127_coding_engine');
const eps = ['code_icd10cm','code_cpt','code_drg','code_hcc','code_query'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
