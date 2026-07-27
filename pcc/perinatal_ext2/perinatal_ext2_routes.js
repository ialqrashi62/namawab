// P3-BJ routes: perinatal_ext2 (Perinatal-Ext-2)
const express = require('express');
const router = express.Router();
const Engine = require('./perinatal_ext2_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'PreeclampsiaSevere',
  'FGR',
  'GDM',
  'PretermLabor',
  'PPROM',
  'MultipleGestation',
  'AnemiaPregnancy',
  'PostpartumHemorrhage',
  'CervicalInsufficiency',
  'RHisoimmunization'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'perinatal_ext2', label: 'Perinatal-Ext-2', functions: fns.length, version: '3.22.0' });
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
  res.json({ ok: true, module: 'perinatal_ext2', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
