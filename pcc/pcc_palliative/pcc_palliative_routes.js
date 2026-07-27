// P3-CV pcc_palliative routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_palliative_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_palliative',
    label: 'PCC Palliative',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Symptom', (req, res) => { const r = Engine.Symptom(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Symptom', plan: r.plan }); })
  router.post('/call/Performance', (req, res) => { const r = Engine.Performance(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Performance', plan: r.plan }); })
  router.post('/call/Prognosis', (req, res) => { const r = Engine.Prognosis(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Prognosis', plan: r.plan }); })
  router.post('/call/Goals', (req, res) => { const r = Engine.Goals(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Goals', plan: r.plan }); })
  router.post('/call/AdvanceCare', (req, res) => { const r = Engine.AdvanceCare(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'AdvanceCare', plan: r.plan }); })
  router.post('/call/FamilyMeeting', (req, res) => { const r = Engine.FamilyMeeting(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'FamilyMeeting', plan: r.plan }); })
  router.post('/call/Hospice', (req, res) => { const r = Engine.Hospice(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Hospice', plan: r.plan }); })
  router.post('/call/Medication', (req, res) => { const r = Engine.Medication(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Medication', plan: r.plan }); })
  router.post('/call/Breakthrough', (req, res) => { const r = Engine.Breakthrough(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Breakthrough', plan: r.plan }); })
  router.post('/call/Spiritual', (req, res) => { const r = Engine.Spiritual(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Spiritual', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_palliative', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
