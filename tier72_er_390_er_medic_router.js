// filepath: tier72_er_390_er_medic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier72_er_390_er_medic_engine');
const eps = ['acute_mi_protocol','stroke_protocol','sepsis_protocol','anaphylaxis_protocol','toxidrome_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
