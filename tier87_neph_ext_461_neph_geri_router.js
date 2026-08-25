// filepath: tier87_neph_ext_461_neph_geri_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier87_neph_ext_461_neph_geri_engine');
const eps = ['geri_neph','elderly_ckd','gentiurian_dialysis','nephro_epidemic','nephro_global'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
