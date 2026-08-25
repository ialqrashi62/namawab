// filepath: tier59_telemedicine_330_tele_surg_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier59_telemedicine_330_tele_surg_engine');
const eps = ['tele_surgical_consult','remote_surgical_mentoring','tele_pre_op_assessment','tele_post_op_followup','tele_pathology_review'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
