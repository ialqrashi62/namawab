// filepath: tier62_spec_care_ext_344_sp_pall_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier62_spec_care_ext_344_sp_pall_engine');
const eps = ['palliative_intake','advance_directive','goals_of_care','comfort_care_order','end_of_life'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
