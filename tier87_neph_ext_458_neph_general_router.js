// filepath: tier87_neph_ext_458_neph_general_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier87_neph_ext_458_neph_general_engine');
const eps = ['neph_clinic','ckd_eval','ckd_followup','glomerulonephritis','polycystic_kidney'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
