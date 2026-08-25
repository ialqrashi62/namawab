// filepath: tier8_rc_ext_103_denial_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier8_rc_ext_103_denial_engine');
const eps = ['denial_categorize','denial_appeal','denial_recovery','denial_prevent','denial_dashboard'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
