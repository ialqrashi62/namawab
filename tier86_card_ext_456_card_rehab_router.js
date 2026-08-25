// filepath: tier86_card_ext_456_card_rehab_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier86_card_ext_456_card_rehab_engine');
const eps = ['cr_initial','cr_phase2','cr_discharge','cr_followup','cr_outcomes'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
