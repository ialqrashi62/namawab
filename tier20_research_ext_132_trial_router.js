// filepath: tier20_research_ext_132_trial_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier20_research_ext_132_trial_engine');
const eps = ['trial_enrollment','trial_eligibility','trial_adverse','trial_protocol_deviation','trial_closeout'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
