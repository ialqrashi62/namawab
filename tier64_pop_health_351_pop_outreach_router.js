// filepath: tier64_pop_health_351_pop_outreach_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier64_pop_health_351_pop_outreach_engine');
const eps = ['outreach_call','outreach_message','outreach_visit','outreach_education','outreach_reminder'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
