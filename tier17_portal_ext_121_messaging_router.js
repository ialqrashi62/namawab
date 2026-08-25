// filepath: tier17_portal_ext_121_messaging_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier17_portal_ext_121_messaging_engine');
const eps = ['portal_message','portal_refill_request','portal_referral_request','portal_proxy_access','portal_consent'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
