// filepath: tier30_hematology_ext_186_cell_therapy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier30_hematology_ext_186_cell_therapy_engine');
const eps = ['car_t_recovery','til_therapy','nk_cell','regenerative_injection','autologous_therapy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
