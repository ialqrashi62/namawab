'use strict';
/**
 * FHIR R4 Server — Express Router
 * Mount: /api/fhir
 */
const express = require('express');
const router = express.Router();
const engine = require('./p0_5_fhir_engine');

router.get('/metadata', (req, res) => {
  res.json({
    resourceType: 'CapabilityStatement',
    status: 'active',
    date: new Date().toISOString(),
    publisher: 'NamaMedical',
    kind: 'instance',
    fhirVersion: '4.0.1',
    format: ['json', 'xml'],
    rest: [{ mode: 'server', resource: [
      { type: 'Patient', interaction: [{ code: 'read' }, { code: 'search-type' }] },
      { type: 'Encounter', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'Observation', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'MedicationRequest', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'Condition', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'AllergyIntolerance', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'Procedure', interaction: [{ code: 'read' }, { code: 'create' }] },
      { type: 'DiagnosticReport', interaction: [{ code: 'read' }, { code: 'create' }] },
    ] }],
  });
});

router.post('/Patient', (req, res) => {
  const validation = engine.fhirValidation(req.body);
  if (!validation.valid) return res.status(400).json({ ok: false, errors: validation.errors });
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

router.post('/bundle/export/csv', (req, res) => {
  const csv = engine.bundleToCSV(req.body);
  res.set('Content-Type', 'text/csv').send(csv);
});

router.post('/bundle/import/csv', (req, res) => {
  const resourceType = req.query.type || 'Patient';
  const bundle = engine.csvToBundle(req.body.csv || '', resourceType);
  res.json({ ok: true, bundle });
});

module.exports = router;
