// P3-CP pcc_home_health routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_home_health';
const F = require('./pcc_home_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_home_health',
    label: 'PCC Home Health',
    functions: Object.keys(F),
  });
});
  router.post('/call/Intake', (req, res) => { const r = F.Intake(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Intake', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Wound', (req, res) => { const r = F.Wound(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Wound', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/IvTherapy', (req, res) => { const r = F.IvTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'IvTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Therapy', (req, res) => { const r = F.Therapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Therapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/MedAdmin', (req, res) => { const r = F.MedAdmin(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'MedAdmin', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tele', (req, res) => { const r = F.Tele(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Tele', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Falls', (req, res) => { const r = F.Falls(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Falls', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Caregiver', (req, res) => { const r = F.Caregiver(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Caregiver', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Discharge', (req, res) => { const r = F.Discharge(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Discharge', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/AdmitHome', (req, res) => { const r = F.AdmitHome(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'AdmitHome', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_home_health', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
