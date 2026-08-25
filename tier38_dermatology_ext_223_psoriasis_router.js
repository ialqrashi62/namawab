// filepath: tier38_dermatology_ext_223_psoriasis_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier38_dermatology_ext_223_psoriasis_engine');
const eps = ['psoriasis_severity','topical_psoriasis','systemic_psoriasis','biologic_psoriasis','psoriasis_arthritis_screen'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
