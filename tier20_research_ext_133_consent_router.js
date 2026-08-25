// filepath: tier20_research_ext_133_consent_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier20_research_ext_133_consent_engine');
const eps = ['consent_obtain','consent_amend','consent_withdrawal','consent_minor','consent_capacity'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
