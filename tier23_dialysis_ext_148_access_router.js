// filepath: tier23_dialysis_ext_148_access_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier23_dialysis_ext_148_access_engine');
const eps = ['access_avf','access_avg','access_catheter','access_stenosis','access_cannulation'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
