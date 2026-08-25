// filepath: tier10_lab_ext_103_micro_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier10_lab_ext_103_micro_engine');
const eps = ['micro_culture_setup','micro_gram_stain','micro_sensitivity','micro_blood_culture','micro_afb_smear'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
