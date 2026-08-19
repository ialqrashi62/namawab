// filepath: tier86_card_ext_455_card_imaging_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier86_card_ext_455_card_imaging_engine');
const eps = ['echo_followup','stress_test','nuclear_imaging','cardiac_mri','cardiac_ct_angio'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
