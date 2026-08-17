// filepath: tier55_triage_ext_310_triage_screen_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier55_triage_ext_310_triage_screen_engine');
const eps = ['suicide_risk_screen','substance_use_screen','domestic_violence_screen','trauma_screen','psychiatric_screen'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
