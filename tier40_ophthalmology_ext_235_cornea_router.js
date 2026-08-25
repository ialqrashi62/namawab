// filepath: tier40_ophthalmology_ext_235_cornea_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier40_ophthalmology_ext_235_cornea_engine');
const eps = ['keratitis','corneal_ulcer','dry_eye','keratoconus','corneal_transplant'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
