// filepath: tier47_radiology_ext_272_rad_interv_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier47_radiology_ext_272_rad_interv_engine');
const eps = ['biopsy_ct_guided','drainage_catheter','embolization_therapy','tumor_ablation','vertebroplasty'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
