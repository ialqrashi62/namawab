// filepath: tier29_cardiology_ext_178_stress_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier29_cardiology_ext_178_stress_engine');
const eps = ['exercise_stress','nuclear_stress','echo_stress','ct_angio','ami_marker'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
