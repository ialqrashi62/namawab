// filepath: tier24_transplant_ext_156_outcome_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier24_transplant_ext_156_outcome_engine');
const eps = ['graft_function','infection_post','malignancy_post','cv_complication','renal_function'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
