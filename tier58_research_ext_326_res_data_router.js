// filepath: tier58_research_ext_326_res_data_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier58_research_ext_326_res_data_engine');
const eps = ['data_collection_form','data_quality_review','interim_analysis','data_lock','database_lock'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
