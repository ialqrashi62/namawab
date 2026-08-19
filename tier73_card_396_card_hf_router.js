// filepath: tier73_card_396_card_hf_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier73_card_396_card_hf_engine');
const eps = ['heart_failure_intake','heart_failure_followup','cardiac_rehab','fluid_mgmt','gwtg_hf_care'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
