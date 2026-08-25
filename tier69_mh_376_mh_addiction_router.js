// filepath: tier69_mh_376_mh_addiction_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier69_mh_376_mh_addiction_engine');
const eps = ['subuse_intake','relapse_prevention','methadone_clinic','naloxone_kits','sbar_counseling'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
