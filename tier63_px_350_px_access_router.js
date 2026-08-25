// filepath: tier63_px_350_px_access_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier63_px_350_px_access_engine');
const eps = ['patient_self_registration','patient_portal_access','patient_mobile_app','patient_waitlist','patient_referral_tracking'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
