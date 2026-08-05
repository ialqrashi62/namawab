// P3-CL pcc_ortho_ext3 routes v3.50.0
// P3-CL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ortho_ext3';
const F = require('./pcc_ortho_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.50.0',
    module: 'pcc_ortho_ext3',
    label: 'PCC Ortho Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Fx', (req, res) => { const r = F.Fx(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Fx', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Joint', (req, res) => { const r = F.Joint(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Joint', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Spine', (req, res) => { const r = F.Spine(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Spine', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sports', (req, res) => { const r = F.Sports(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Sports', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Pediatric', (req, res) => { const r = F.Pediatric(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Pediatric', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tumor', (req, res) => { const r = F.Tumor(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Tumor', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hand', (req, res) => { const r = F.Hand(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Hand', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Foot', (req, res) => { const r = F.Foot(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Foot', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Postop', (req, res) => { const r = F.Postop(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Postop', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Rehab', (req, res) => { const r = F.Rehab(req.body || {}); res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: 'Rehab', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.50.0', module: 'pcc_ortho_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
