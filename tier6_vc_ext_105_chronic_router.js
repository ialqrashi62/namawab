// filepath: tier6_vc_ext_105_chronic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier6_vc_ext_105_chronic_engine');
const eps = ['ccm_enroll','ccm_care_plan','ccm_coaching','ccm_medication_review','ccm_outcomes'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;