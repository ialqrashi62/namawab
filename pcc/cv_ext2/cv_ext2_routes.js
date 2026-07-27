// P3-BH routes: cv_ext2 (CV-Ext-2)
const express = require('express');
const router = express.Router();
const Engine = require('./cv_ext2_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'ACS',
  'HeartFailure',
  'Arrhythmia',
  'ValveDisease',
  'Hypertension',
  'Anticoagulation',
  'LipidMgmt',
  'PAD',
  'Cardiomyopathy',
  'Pericardial'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'cv_ext2', label: 'CV-Ext-2', functions: fns.length, version: '3.20.0' });
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
  res.json({ ok: true, module: 'cv_ext2', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
