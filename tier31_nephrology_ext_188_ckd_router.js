// filepath: tier31_nephrology_ext_188_ckd_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier31_nephrology_ext_188_ckd_engine');
const eps = ['ckd_stage','proteinuria','anemia_ckd','mineral_bone','ckd_progression'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
