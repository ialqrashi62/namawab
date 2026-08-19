// filepath: tier81_uro_ext_428_uro_general_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier81_uro_ext_428_uro_general_engine');
const eps = ['uro_clinic','hematuria_workup','incontinence','urodynamics','prostate_benign'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
