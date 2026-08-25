// filepath: tier8_rc_ext_101_coding_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier8_rc_ext_101_coding_engine');
const eps = ['coding_icd10_suggest','coding_cpt_assign','coding_hcc_risk','coding_drg_assign','coding_audit'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
