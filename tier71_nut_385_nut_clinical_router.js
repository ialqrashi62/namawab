// filepath: tier71_nut_385_nut_clinical_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier71_nut_385_nut_clinical_engine');
const eps = ['diabetes_medical_nutrition','renal_diet_education','cardiac_diet_education','oncology_nutrition_support','weight_management'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
