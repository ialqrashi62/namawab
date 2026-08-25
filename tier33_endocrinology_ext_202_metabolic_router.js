// filepath: tier33_endocrinology_ext_202_metabolic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier33_endocrinology_ext_202_metabolic_engine');
const eps = ['obesity_management','lipid_management','osteoporosis','pcos','gender_dysphoria'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
