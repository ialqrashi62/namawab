// filepath: tier70_img_diag_382_img_safety_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier70_img_diag_382_img_safety_engine');
const eps = ['contrast_adverse_event','imaging_dose','radiology_safety_check','pregnancy_check','contrast_screening'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
