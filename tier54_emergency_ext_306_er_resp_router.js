// filepath: tier54_emergency_ext_306_er_resp_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier54_emergency_ext_306_er_resp_engine');
const eps = ['respiratory_failure_emergent','asthma_exacerbation_severe','pneumothorax_tension','pulmonary_embola_massive','hemoptysis_massive'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
