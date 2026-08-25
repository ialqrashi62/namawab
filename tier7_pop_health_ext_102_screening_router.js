// filepath: tier7_pop_health_ext_102_screening_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier7_pop_health_ext_102_screening_engine');
const eps = ['screening_mammogram','screening_colorectal','screening_cervical','screening_lung','screening_overdue'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
