// P3-CH pcc_surgical_ext routes v3.46.0
// P3-CH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_surgical_ext';
const F = require('./pcc_surgical_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.46.0',
    module: 'pcc_surgical_ext',
    label: 'PCC Surgical Ext',
    functions: Object.keys(F),
  });
});
  router.post('/call/Urgency', (req, res) => { const r = F.Urgency(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Urgency', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Approach', (req, res) => { const r = F.Approach(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Approach', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Positioning', (req, res) => { const r = F.Positioning(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Positioning', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Timeout', (req, res) => { const r = F.Timeout(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Timeout', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Counts', (req, res) => { const r = F.Counts(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Counts', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Antibiotic', (req, res) => { const r = F.Antibiotic(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Antibiotic', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Dvt', (req, res) => { const r = F.Dvt(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Dvt', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Implant', (req, res) => { const r = F.Implant(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Implant', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Anesthesia', (req, res) => { const r = F.Anesthesia(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Anesthesia', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Specimen', (req, res) => { const r = F.Specimen(req.body || {}); res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: 'Specimen', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.46.0', module: 'pcc_surgical_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
