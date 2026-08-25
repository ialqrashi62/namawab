// filepath: tier73_card_397_card_admin_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier73_card_397_card_admin_engine');
const eps = ['cardiac_consent','cardiac_quality','cardiac_readmission','cardiac_med_rec','cardiac_infection'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
