// filepath: tier83_derm_ext_438_derm_general_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier83_derm_ext_438_derm_general_engine');
const eps = ['skin_exam','rash_eval','skin_biopsy','derm_visit','topical_prescription'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
