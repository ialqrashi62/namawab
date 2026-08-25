// filepath: tier75_pulm_ext_401_pulm_special_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier75_pulm_ext_401_pulm_special_engine');
const eps = ['sleep_study_referral','oxygen_therapy_setup','cpap_bpap_management','pulmonary_rehab','inhaler_technique_assessment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
