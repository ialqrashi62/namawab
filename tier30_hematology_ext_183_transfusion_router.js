// filepath: tier30_hematology_ext_183_transfusion_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier30_hematology_ext_183_transfusion_engine');
const eps = ['blood_type_screen','crossmatch','prbc_transfusion','platelet_transfusion','plasma_transfusion'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
