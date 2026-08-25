// filepath: tier86_card_ext_457_card_arrhythmia_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier86_card_ext_457_card_arrhythmia_engine');
const eps = ['afib_initial','afib_followup','anticoag_clinic','vt_eval','device_check'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
