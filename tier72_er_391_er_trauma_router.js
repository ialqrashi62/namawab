// filepath: tier72_er_391_er_trauma_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier72_er_391_er_trauma_engine');
const eps = ['primary_survey','secondary_survey','fracture_reduction','wound_exploration','trauma_sedation'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
