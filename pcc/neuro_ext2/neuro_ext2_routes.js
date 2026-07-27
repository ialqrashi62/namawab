// P3-BH routes: neuro_ext2 (Neuro-Ext-2)
const express = require('express');
const router = express.Router();
const Engine = require('./neuro_ext2_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'StrokeTriage',
  'Migraine',
  'Seizure',
  'Parkinsons',
  'MSRelapse',
  'DementiaEval',
  'GBS',
  'Myasthenia',
  'Neuropathy',
  'BrainTumor'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'neuro_ext2', label: 'Neuro-Ext-2', functions: fns.length, version: '3.20.0' });
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
  res.json({ ok: true, module: 'neuro_ext2', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
