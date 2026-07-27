// P3-BE routes: transplant_living (Transplant-Living)
const express = require('express');
const router = express.Router();
const Engine = require('./transplant_living_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'LivingDonorWorkup',
  'DonorNephrectomy',
  'PairedExchange',
  'LivingDonorFollowup',
  'ABOiTransplant',
  'Desensitization',
  'LDRecipient',
  'LDOutcomes',
  'LDRecipientDose',
  'LDComplications'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'transplant_living', label: 'Transplant-Living', functions: fns.length, version: '3.17.0' });
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
  res.json({ ok: true, module: 'transplant_living', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
