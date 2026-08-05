// P3-CJ pcc_ob_ext2 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const VER = 'v3.316.0';
const MOD = 'pcc_ob_ext2';
const F = require('./pcc_ob_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_ob_ext2',
    label: 'PCC OB Ext2',
    functions: Object.keys(F),
  });
});
  router.post('/call/GADobstetric', (req, res) => { const r = F.GADobstetric(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'GADobstetric', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Labor', (req, res) => { const r = F.Labor(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Labor', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Mode', (req, res) => { const r = F.Mode(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Mode', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/FHR', (req, res) => { const r = F.FHR(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'FHR', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Filter', (req, res) => { const r = F.Filter(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Filter', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/PostnatalCare', (req, res) => { const r = F.PostnatalCare(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'PostnatalCare', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Bleeding', (req, res) => { const r = F.Bleeding(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Bleeding', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Screening', (req, res) => { const r = F.Screening(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Screening', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Antenatal', (req, res) => { const r = F.Antenatal(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Antenatal', plan: r.plan, score: r.score, score: r.score }); })
  router.post('/call/Risk', (req, res) => { const r = F.Risk(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Risk', plan: r.plan, score: r.score, score: r.score }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});
module.exports = router;
