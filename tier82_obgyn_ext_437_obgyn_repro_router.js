// filepath: tier82_obgyn_ext_437_obgyn_repro_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier82_obgyn_ext_437_obgyn_repro_engine');
const eps = ['ivf_cycle','iui_cycle','recurrent_pregnancy_loss','pcos_eval','endometriosis'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
