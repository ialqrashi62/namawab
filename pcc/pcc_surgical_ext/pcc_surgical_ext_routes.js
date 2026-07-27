// P3-CH pcc_surgical_ext routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_surgical_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_surgical_ext',
    label: 'PCC Surgical Ext',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Urgency', (req, res) => { const r = Engine.Urgency(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Urgency', plan: r.plan }); })
  router.post('/call/Approach', (req, res) => { const r = Engine.Approach(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Approach', plan: r.plan }); })
  router.post('/call/Positioning', (req, res) => { const r = Engine.Positioning(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Positioning', plan: r.plan }); })
  router.post('/call/Timeout', (req, res) => { const r = Engine.Timeout(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Timeout', plan: r.plan }); })
  router.post('/call/Counts', (req, res) => { const r = Engine.Counts(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Counts', plan: r.plan }); })
  router.post('/call/Antibiotic', (req, res) => { const r = Engine.Antibiotic(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Antibiotic', plan: r.plan }); })
  router.post('/call/Dvt', (req, res) => { const r = Engine.Dvt(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Dvt', plan: r.plan }); })
  router.post('/call/Implant', (req, res) => { const r = Engine.Implant(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Implant', plan: r.plan }); })
  router.post('/call/Anesthesia', (req, res) => { const r = Engine.Anesthesia(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Anesthesia', plan: r.plan }); })
  router.post('/call/Specimen', (req, res) => { const r = Engine.Specimen(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Specimen', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
