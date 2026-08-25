// filepath: tier23_dialysis_ext_151_peritoneal_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier23_dialysis_ext_151_peritoneal_engine');
const eps = ['pet_test','peritonitis','uf_capacity','pd_adequacy','catheter_pd'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
