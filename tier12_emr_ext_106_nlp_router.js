// filepath: tier12_emr_ext_106_nlp_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier12_emr_ext_106_nlp_engine');
const eps = ['nlp_extract_terms','nlp_cds_alert','nlp_disease_extract','nlp_med_extract','nlp_summary_quality'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
