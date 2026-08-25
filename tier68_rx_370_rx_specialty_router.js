// filepath: tier68_rx_370_rx_specialty_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier68_rx_370_rx_specialty_engine');
const eps = ['biologic_order','biologic_infusion','biologic_monitoring','biologic_immunogenicity','specialty_appeals'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
