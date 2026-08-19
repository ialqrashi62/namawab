// filepath: tier77_neuro_ext_408_neuro_stroke_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier77_neuro_ext_408_neuro_stroke_engine');
const eps = ['stroke_initial','stroke_thrombolysis','stroke_post_care','stroke_rehab','stroke_secondary_prevention'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
