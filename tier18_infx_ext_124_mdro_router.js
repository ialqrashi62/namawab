// filepath: tier18_infx_ext_124_mdro_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier18_infx_ext_124_mdro_engine');
const eps = ['mdro_screen','mdro_decolonize','mdro_antibiotic_steward','mdro_precautions','mdro_culture_followup'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
