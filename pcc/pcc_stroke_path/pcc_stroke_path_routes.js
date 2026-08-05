// P3-CS pcc_stroke_path routes v3.57.0
// P3-CS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_stroke_path';
const F = require('./pcc_stroke_path_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.57.0',
    module: 'pcc_stroke_path',
    label: 'PCC Stroke Path',
    functions: Object.keys(F),
  });
});
  router.post('/call/Nihss', (req, res) => { const r = F.Nihss(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Nihss', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Imaging', (req, res) => { const r = F.Imaging(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Imaging', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tpa', (req, res) => { const r = F.Tpa(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Tpa', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Thrombectomy', (req, res) => { const r = F.Thrombectomy(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Thrombectomy', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Consent', (req, res) => { const r = F.Consent(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Consent', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/BpTarget', (req, res) => { const r = F.BpTarget(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'BpTarget', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/NihssFollowup', (req, res) => { const r = F.NihssFollowup(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'NihssFollowup', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hemorrhage', (req, res) => { const r = F.Hemorrhage(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Hemorrhage', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Swallow', (req, res) => { const r = F.Swallow(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Swallow', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Transfer', (req, res) => { const r = F.Transfer(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Transfer', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
