// filepath: tier52_rehabilitation_ext_294_rehab_ot_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier52_rehabilitation_ext_294_rehab_ot_engine');
const eps = ['adl_training','hand_therapy_upper_limb','cognitive_rehab','splinting','work_hardening'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
