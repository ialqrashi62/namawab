// filepath: tier12_emr_ext_103_fhir_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier12_emr_ext_103_fhir_engine');
const eps = ['fhir_patient_map','fhir_observation_map','fhir_medication_map','fhir_encounter_map','fhir_bundle'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
