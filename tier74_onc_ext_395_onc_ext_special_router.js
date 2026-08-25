// filepath: tier74_onc_ext_395_onc_ext_special_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier74_onc_ext_395_onc_ext_special_engine');
const eps = ['tumor_board_review','genetic_counseling_onc','cancer_staging','performance_status','clinical_trial_screening'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
