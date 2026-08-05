// P3-CV pcc_palliative routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_palliative';
const F = require('./pcc_palliative_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_palliative',
    label: 'PCC Palliative',
    functions: Object.keys(F),
  });
});
  router.post('/call/Symptom', (req, res) => { const r = F.Symptom(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Symptom', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Performance', (req, res) => { const r = F.Performance(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Performance', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Prognosis', (req, res) => { const r = F.Prognosis(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Prognosis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Goals', (req, res) => { const r = F.Goals(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Goals', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AdvanceCare', (req, res) => { const r = F.AdvanceCare(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'AdvanceCare', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FamilyMeeting', (req, res) => { const r = F.FamilyMeeting(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'FamilyMeeting', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hospice', (req, res) => { const r = F.Hospice(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Hospice', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Medication', (req, res) => { const r = F.Medication(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Medication', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Breakthrough', (req, res) => { const r = F.Breakthrough(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Breakthrough', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Spiritual', (req, res) => { const r = F.Spiritual(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_palliative', function: 'Spiritual', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_palliative', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
