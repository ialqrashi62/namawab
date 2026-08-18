// filepath: tier68_rx_371_rx_clinical_pharm_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier68_rx_371_rx_clinical_pharm_engine');
const eps = ['pharmacokinetics_dosing','renal_dosing','hepatic_dosing','warfarin_dosing','vancomycin_dosing'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
