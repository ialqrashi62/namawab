// filepath: tier48_laboratory_ext_273_lab_heme_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier48_laboratory_ext_273_lab_heme_engine');
const eps = ['complete_blood_count','coagulation_panel','d_dimer','fibrinogen','blood_smear'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
