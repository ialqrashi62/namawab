// filepath: tier74_onc_ext_393_onc_ext_treat_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier74_onc_ext_393_onc_ext_treat_engine');
const eps = ['chemo_regimen_select','targeted_therapy_order','immunotherapy_order','hormone_therapy_order','radiation_oncology_order'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
