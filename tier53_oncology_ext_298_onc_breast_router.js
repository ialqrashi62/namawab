// filepath: tier53_oncology_ext_298_onc_breast_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier53_oncology_ext_298_onc_breast_engine');
const eps = ['early_breast_cancer','advanced_breast_cancer','dcis','her2_pos_breast','triple_neg_breast'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
