// filepath: tier58_research_ext_327_res_ethics_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier58_research_ext_327_res_ethics_engine');
const eps = ['irb_submission','irb_amendment','irb_continuing_review','consent_form_revision','subject_withdrawal'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
