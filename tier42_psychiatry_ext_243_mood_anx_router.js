// filepath: tier42_psychiatry_ext_243_mood_anx_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier42_psychiatry_ext_243_mood_anx_engine');
const eps = ['depression_mdd','generalized_anxiety','panic_disorder','bipolar_disorder','social_anxiety'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
