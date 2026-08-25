// filepath: tier74_onc_ext_396_onc_ext_symptom_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier74_onc_ext_396_onc_ext_symptom_engine');
const eps = ['cancer_pain_management','nausea_management_chemo','fatigue_assessment','cancer_associated_thrombosis','cachexia_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
