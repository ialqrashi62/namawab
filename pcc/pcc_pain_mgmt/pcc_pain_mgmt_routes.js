// P3-CV pcc_pain_mgmt routes v3.60.0
// P3-CV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_pain_mgmt_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.60.0',
    module: 'pcc_pain_mgmt',
    label: 'PCC Pain Management',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Nrs', (req, res) => { const r = Engine.Nrs(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Nrs', plan: r.plan }); })
  router.post('/call/OpioidRisk', (req, res) => { const r = Engine.OpioidRisk(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'OpioidRisk', plan: r.plan }); })
  router.post('/call/Adjuvant', (req, res) => { const r = Engine.Adjuvant(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Adjuvant', plan: r.plan }); })
  router.post('/call/Breakthrough', (req, res) => { const r = Engine.Breakthrough(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Breakthrough', plan: r.plan }); })
  router.post('/call/Bowel', (req, res) => { const r = Engine.Bowel(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Bowel', plan: r.plan }); })
  router.post('/call/Sedation', (req, res) => { const r = Engine.Sedation(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Sedation', plan: r.plan }); })
  router.post('/call/Nausea', (req, res) => { const r = Engine.Nausea(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Nausea', plan: r.plan }); })
  router.post('/call/Itch', (req, res) => { const r = Engine.Itch(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Itch', plan: r.plan }); })
  router.post('/call/Respiratory', (req, res) => { const r = Engine.Respiratory(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Respiratory', plan: r.plan }); })
  router.post('/call/Urinary', (req, res) => { const r = Engine.Urinary(req.body || {}); res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: 'Urinary', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.60.0', module: 'pcc_pain_mgmt', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
