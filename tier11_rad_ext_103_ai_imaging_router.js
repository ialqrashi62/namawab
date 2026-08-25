// filepath: tier11_rad_ext_103_ai_imaging_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier11_rad_ext_103_ai_imaging_engine');
const eps = ['ai_triage','ai_detection','ai_segmentation','ai_quantification','ai_worklist'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
