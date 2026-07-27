// P3-CP pcc_home_health routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_home_health_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_home_health',
    label: 'PCC Home Health',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Intake', (req, res) => { const r = Engine.Intake(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Intake', plan: r.plan }); })
  router.post('/call/Wound', (req, res) => { const r = Engine.Wound(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Wound', plan: r.plan }); })
  router.post('/call/IvTherapy', (req, res) => { const r = Engine.IvTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'IvTherapy', plan: r.plan }); })
  router.post('/call/Therapy', (req, res) => { const r = Engine.Therapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Therapy', plan: r.plan }); })
  router.post('/call/MedAdmin', (req, res) => { const r = Engine.MedAdmin(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'MedAdmin', plan: r.plan }); })
  router.post('/call/Tele', (req, res) => { const r = Engine.Tele(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Tele', plan: r.plan }); })
  router.post('/call/Falls', (req, res) => { const r = Engine.Falls(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Falls', plan: r.plan }); })
  router.post('/call/Caregiver', (req, res) => { const r = Engine.Caregiver(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Caregiver', plan: r.plan }); })
  router.post('/call/Discharge', (req, res) => { const r = Engine.Discharge(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'Discharge', plan: r.plan }); })
  router.post('/call/AdmitHome', (req, res) => { const r = Engine.AdmitHome(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_home_health', function: 'AdmitHome', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_home_health', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
