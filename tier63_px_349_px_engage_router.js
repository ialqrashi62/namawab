// filepath: tier63_px_349_px_engage_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier63_px_349_px_engage_engine');
const eps = ['patient_engagement','patient_community','patient_education_enrollment','patient_workshop','patient_app_feature_use'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
