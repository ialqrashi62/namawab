// filepath: tier71_nut_386_nut_pediatric_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier71_nut_386_nut_pediatric_engine');
const eps = ['breast_feeding_support','infant_formula','intolerance_assessment_pediatric','pediatric_growth_assessment','pediatric_nutrition_counseling'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
