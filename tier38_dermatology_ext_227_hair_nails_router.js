// filepath: tier38_dermatology_ext_227_hair_nails_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier38_dermatology_ext_227_hair_nails_engine');
const eps = ['alopecia','hair_loss_workup','onychomycosis','paronychia','autoimmune_skin'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
