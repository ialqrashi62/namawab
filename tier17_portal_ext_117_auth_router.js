// filepath: tier17_portal_ext_117_auth_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier17_portal_ext_117_auth_engine');
const eps = ['portal_register','portal_login','portal_session','portal_password_reset','portal_audit'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
