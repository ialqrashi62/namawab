// filepath: tier76_endo_ext_405_endo_adrenal_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier76_endo_ext_405_endo_adrenal_engine');
const eps = ['adrenal_incidentaloma','adrenal_workup','adrenal_surgery','cushings_workup','adrenal_insufficiency'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
