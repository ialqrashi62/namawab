// P3-BF routes: womens_health_ext (Womens-Health-Ext)
const express = require('express');
const router = express.Router();
const Engine = require('./womens_health_ext_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'WellWoman',
  'Menopause',
  'PCOSWH',
  'EndometriosisWH',
  'UTI',
  'STI',
  'CervicalScreen',
  'Urogyn',
  'PelvicFloorWH',
  'IVFandGyn'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'womens_health_ext', label: 'Womens-Health-Ext', functions: fns.length, version: '3.18.0' });
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
  res.json({ ok: true, module: 'womens_health_ext', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
