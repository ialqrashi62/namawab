// filepath: tier71_nut_384_nut_intervention_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier71_nut_384_nut_intervention_engine');
const eps = ['nutrition_counseling','medical_nutrition_therapy','supplement_recommendation','enteral_feeding','parenteral_nutrition'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
