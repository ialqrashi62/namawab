// filepath: tier60_ai_brain_ext_334_ai_diag_img_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier60_ai_brain_ext_334_ai_diag_img_engine');
const eps = ['radiology_ai_assist','pathology_ai_assist','dermatology_ai_assist','ecg_ai_assist','retinal_ai_screening'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
