'use strict';
/**
 * P0-5 FHIR R4 Router
 * Mount: /api/fhir
 */
const express = require('express');
const router = express.Router();
const engine = require('./p0_5_fhir_engine');

router.get('/metadata', (req, res) => {
  res.json({ resourceType: 'CapabilityStatement', status: 'active', date: new Date().toISOString(), publisher: 'NamaMedical', fhirVersion: '4.0.1', format: ['json', 'xml'] });
});

router.post('/Patient', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/Encounter', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/Observation', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/MedicationRequest', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/Condition', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/AllergyIntolerance', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/Procedure', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});
router.post('/DiagnosticReport', (req, res) => {
  const v = engine.fhirValidation(req.body);
  if (!v.valid) return res.status(400).json({ ok: false, errors: v.errors });
  res.status(201).json({ ok: true, resource: req.body });
});

module.exports = router;