// filepath: tier16_or_ext_113_intraop_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier16_or_ext_113_intraop_engine');
const eps = ['intraop_anesthesia','intraop_monitoring','intraop_timeout','intraop_events','intraop_sponge_count'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
