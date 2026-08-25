// filepath: tier85_pain_ext_448_pain_acute_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier85_pain_ext_448_pain_acute_engine');
const eps = ['acute_pain','ed_pain','trauma_pain','cancer_pain','post_op_pain_titrated'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
