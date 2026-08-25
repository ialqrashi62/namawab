// filepath: tier54_emergency_ext_303_er_trauma_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier54_emergency_ext_303_er_trauma_engine');
const eps = ['polytrauma','burn_thermal','trauma_amputation','blast_injury','penetrating_trauma'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
