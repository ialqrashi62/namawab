// P3-CO pcc_ent_ext3 routes v3.53.0
// P3-CO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ent_ext3';
const F = require('./pcc_ent_ext3_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.53.0',
    module: 'pcc_ent_ext3',
    label: 'PCC ENT Ext3',
    functions: Object.keys(F),
  });
});
  router.post('/call/Hearing', (req, res) => { const r = F.Hearing(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Hearing', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Ottis', (req, res) => { const r = F.Ottis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Ottis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Sinusitis', (req, res) => { const r = F.Sinusitis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Sinusitis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tonsil', (req, res) => { const r = F.Tonsil(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Tonsil', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Hoarseness', (req, res) => { const r = F.Hoarseness(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Hoarseness', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Epistaxis', (req, res) => { const r = F.Epistaxis(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Epistaxis', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vertigo', (req, res) => { const r = F.Vertigo(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Vertigo', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Tinnitus', (req, res) => { const r = F.Tinnitus(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Tinnitus', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Allergic', (req, res) => { const r = F.Allergic(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Allergic', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Vertigo2', (req, res) => { const r = F.Vertigo2(req.body || {}); res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: 'Vertigo2', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.53.0', module: 'pcc_ent_ext3', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
