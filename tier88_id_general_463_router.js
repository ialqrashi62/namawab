// filepath: tier88_id_general_463_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier88_id_general_463_engine');
const eps = ['id_clinic','fever_workup','sepsis','tb','hiv_visit'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
