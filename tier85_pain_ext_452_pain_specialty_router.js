// filepath: tier85_pain_ext_452_pain_specialty_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier85_pain_ext_452_pain_specialty_engine');
const eps = ['headache_pain','pelvic_pain','cancer_pain_specialty','pediatric_pain','pain_psych'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
