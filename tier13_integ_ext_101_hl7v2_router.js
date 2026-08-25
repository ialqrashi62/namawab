// filepath: tier13_integ_ext_101_hl7v2_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier13_integ_ext_101_hl7v2_engine');
const eps = ['hl7_parse','hl7_ack','hl7_route','hl7_validate_segment','hl7_duplicate_check'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
