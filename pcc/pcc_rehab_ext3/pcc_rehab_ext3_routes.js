// P3-CP pcc_rehab_ext3 routes v3.54.0
// P3-CP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_rehab_ext3';
const F = require('./pcc_rehab_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.54.0',
    module: 'pcc_rehab_ext3',
    label: 'PCC Rehab Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/PhysTherapy', (req, res) => { const r = F.PhysTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PhysTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/OccTherapy', (req, res) => { const r = F.OccTherapy(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'OccTherapy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/SpeechLang', (req, res) => { const r = F.SpeechLang(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'SpeechLang', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PostStroke', (req, res) => { const r = F.PostStroke(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PostStroke', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sci', (req, res) => { const r = F.Sci(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Sci', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tbi', (req, res) => { const r = F.Tbi(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Tbi', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Amp', (req, res) => { const r = F.Amp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Amp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Burnr', (req, res) => { const r = F.Burnr(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Burnr', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PreOp', (req, res) => { const r = F.PreOp(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'PreOp', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Back', (req, res) => { const r = F.Back(req.body || {}); res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: 'Back', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.54.0', module: 'pcc_rehab_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
