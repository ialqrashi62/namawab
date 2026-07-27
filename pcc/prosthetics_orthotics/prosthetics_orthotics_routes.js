// P3-AZ routes: prosthetics_orthotics (Prosthetics-Orthotics)
const express = require('express');
const router = express.Router();
const Engine = require('./prosthetics_orthotics_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'ProstheticPrescription',
  'SocketFit',
  'OrthoticPrescription',
  'OrthoticScoliosis',
  'ProstheticGait',
  'ProstheticTraining',
  'OrthoticComplications',
  'ActivityKLevel',
  'PediatricProsthetic',
  'DeviceFollowup'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'prosthetics_orthotics', label: 'Prosthetics-Orthotics', functions: fns.length, version: '3.12.0' });
});

router.post('/call/:fn', authenticate, (req, res) => {
  const fnName = req.params.fn;
  const fn = Engine[fnName];
  if (!fn) return res.status(404).json({ error: 'function-not-found' });
  try {
    const result = fn(req.body || {});
    res.json({ ok: true, fn: fnName, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, patient_id, encounter_id, payload } = req.body || {};
  if (!tenant_id || !patient_id) return res.status(400).json({ error: 'tenant_id-and-patient_id-required' });
  res.json({ ok: true, module: 'prosthetics_orthotics', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
