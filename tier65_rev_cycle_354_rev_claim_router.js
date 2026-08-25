// filepath: tier65_rev_cycle_354_rev_claim_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier65_rev_cycle_354_rev_claim_engine');
const eps = ['claim_creation','claim_scrubbing','claim_submission','claim_status','claim_resubmission'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
