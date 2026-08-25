// filepath: tier37_neurology_ext_218_stroke_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier37_neurology_ext_218_stroke_engine');
const eps = ['stroke_classification','tpa_eligibility','thrombectomy','secondary_prevention','stroke_rehab'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
