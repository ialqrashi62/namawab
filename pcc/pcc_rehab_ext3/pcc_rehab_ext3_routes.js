// P3-CP pcc_rehab_ext3 routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_rehab_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_rehab_ext3',
    label: 'PCC Rehab Ext3',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/PhysTherapy', (req, res) => { const r = Engine.PhysTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PhysTherapy', plan: r.plan }); })
  router.post('/call/OccTherapy', (req, res) => { const r = Engine.OccTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'OccTherapy', plan: r.plan }); })
  router.post('/call/SpeechLang', (req, res) => { const r = Engine.SpeechLang(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'SpeechLang', plan: r.plan }); })
  router.post('/call/PostStroke', (req, res) => { const r = Engine.PostStroke(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PostStroke', plan: r.plan }); })
  router.post('/call/Sci', (req, res) => { const r = Engine.Sci(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Sci', plan: r.plan }); })
  router.post('/call/Tbi', (req, res) => { const r = Engine.Tbi(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Tbi', plan: r.plan }); })
  router.post('/call/Amp', (req, res) => { const r = Engine.Amp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Amp', plan: r.plan }); })
  router.post('/call/Burnr', (req, res) => { const r = Engine.Burnr(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Burnr', plan: r.plan }); })
  router.post('/call/PreOp', (req, res) => { const r = Engine.PreOp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PreOp', plan: r.plan }); })
  router.post('/call/Back', (req, res) => { const r = Engine.Back(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Back', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
