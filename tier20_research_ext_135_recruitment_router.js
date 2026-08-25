// filepath: tier20_research_ext_135_recruitment_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier20_research_ext_135_recruitment_engine');
const eps = ['recruit_screening','recruit_eligibility_check','recruit_consent_screen','recruit_database_match','recruit_metrics'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
