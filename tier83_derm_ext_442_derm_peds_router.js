// filepath: tier83_derm_ext_442_derm_peds_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier83_derm_ext_442_derm_peds_engine');
const eps = ['pediatric_eczema','congenital_nevi','birthmarks','atopic','papular'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
