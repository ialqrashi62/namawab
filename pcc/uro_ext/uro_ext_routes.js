// P3-BP routes: uro_ext (Uro-Ext)
const express = require('express');
const router = express.Router();
const Engine = require('./uro_ext_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'BPH',
  'ProstateCancer',
  'KidneyStone',
  'UTI',
  'Hematuria',
  'ED',
  'Incontinence',
  'Testicular',
  'Penile',
  'BladderCancer'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'uro_ext', label: 'Uro-Ext', functions: fns.length, version: '3.28.0' });
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
  res.json({ ok: true, module: 'uro_ext', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
