// filepath: tier53_oncology_ext_300_onc_gi_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier53_oncology_ext_300_onc_gi_engine');
const eps = ['colon_cancer','rectal_cancer','pancreatic_cancer','gastric_cancer','esophageal_cancer'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
