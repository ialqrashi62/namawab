// filepath: tier13_integ_ext_104_webhook_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier13_integ_ext_104_webhook_engine');
const eps = ['webhook_publish','webhook_receive','webhook_retry','webhook_signature','webhook_subscription'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
