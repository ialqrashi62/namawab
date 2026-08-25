// filepath: tier78_ortho_ext_417_ortho_pediatric_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier78_ortho_ext_417_ortho_pediatric_engine');
const eps = ['developmental_dysplasia','clubfoot','scoliosis_juvenile','slipped_capital_femoral','pediatric_fracture'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
