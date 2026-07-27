// P3-CS pcc_stroke_path routes v3.57.0
// P3-CS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_stroke_path_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.57.0',
    module: 'pcc_stroke_path',
    label: 'PCC Stroke Path',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Nihss', (req, res) => { const r = Engine.Nihss(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Nihss', plan: r.plan }); })
  router.post('/call/Imaging', (req, res) => { const r = Engine.Imaging(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Imaging', plan: r.plan }); })
  router.post('/call/Tpa', (req, res) => { const r = Engine.Tpa(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Tpa', plan: r.plan }); })
  router.post('/call/Thrombectomy', (req, res) => { const r = Engine.Thrombectomy(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Thrombectomy', plan: r.plan }); })
  router.post('/call/Consent', (req, res) => { const r = Engine.Consent(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Consent', plan: r.plan }); })
  router.post('/call/BpTarget', (req, res) => { const r = Engine.BpTarget(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'BpTarget', plan: r.plan }); })
  router.post('/call/NihssFollowup', (req, res) => { const r = Engine.NihssFollowup(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'NihssFollowup', plan: r.plan }); })
  router.post('/call/Hemorrhage', (req, res) => { const r = Engine.Hemorrhage(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Hemorrhage', plan: r.plan }); })
  router.post('/call/Swallow', (req, res) => { const r = Engine.Swallow(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Swallow', plan: r.plan }); })
  router.post('/call/Transfer', (req, res) => { const r = Engine.Transfer(req.body || {}); res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: 'Transfer', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.57.0', module: 'pcc_stroke_path', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
