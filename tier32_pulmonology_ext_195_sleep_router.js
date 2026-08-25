// filepath: tier32_pulmonology_ext_195_sleep_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier32_pulmonology_ext_195_sleep_engine');
const eps = ['sleep_study','osa_severity','cpap_titration','sleep_hygiene','sleep_medication'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
