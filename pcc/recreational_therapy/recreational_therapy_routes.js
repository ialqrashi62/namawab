// P3-AX routes: recreational_therapy (Recreational-Therapy)
const express = require('express');
const router = express.Router();
const Engine = require('./recreational_therapy_engine.js');

function authenticate(req, res, next) { return next(); }

const fns = [
  'RTAssessment',
  'LeisureBarriers',
  'CommunityReintegration',
  'AdaptedSports',
  'RTPediatric',
  'RTGeriatric',
  'RTDosing',
  'RTInpatient',
  'RTWellness',
  'RTDischarge'
];

router.get('/list', authenticate, (req, res) => {
  res.json({ module: 'recreational_therapy', label: 'Recreational-Therapy', functions: fns.length, version: '3.10.0' });
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
  res.json({ ok: true, module: 'recreational_therapy', tenant_id, patient_id, encounter_id: encounter_id || null, payload: payload || {}, createdAt: new Date().toISOString() });
});

module.exports = router;
