// P3-CO pcc_ophth_ext2 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ophth_ext2';
const F = require('./pcc_ophth_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_ophth_ext2',
    label: 'PCC Ophth Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/Visual', (req, res) => { const r = F.Visual(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Visual', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Cataract', (req, res) => { const r = F.Cataract(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Cataract', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Glaucoma', (req, res) => { const r = F.Glaucoma(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Glaucoma', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Retina', (req, res) => { const r = F.Retina(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Retina', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Uveitis', (req, res) => { const r = F.Uveitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Uveitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Conjunctivitis', (req, res) => { const r = F.Conjunctivitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Conjunctivitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Keratitis', (req, res) => { const r = F.Keratitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Keratitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Macular', (req, res) => { const r = F.Macular(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Macular', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Strab', (req, res) => { const r = F.Strab(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Strab', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Trauma', (req, res) => { const r = F.Trauma(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: 'Trauma', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_ophth_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
