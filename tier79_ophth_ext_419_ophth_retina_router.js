// filepath: tier79_ophth_ext_419_ophth_retina_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier79_ophth_ext_419_ophth_retina_engine');
const eps = ['diabetic_retinopathy','amd_management','retinal_detachment','intravitreal_injection','oct_scan'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
