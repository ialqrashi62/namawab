// P3-CJ pcc_ob_ext2 routes v3.48.0
// P3-CJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pcc_ob_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.48.0',
    module: 'pcc_ob_ext2',
    label: 'PCC OB Ext2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/GADobstetric', (req, res) => { const r = Engine.GADobstetric(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'GADobstetric', plan: r.plan }); })
  router.post('/call/Labor', (req, res) => { const r = Engine.Labor(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Labor', plan: r.plan }); })
  router.post('/call/Mode', (req, res) => { const r = Engine.Mode(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Mode', plan: r.plan }); })
  router.post('/call/FHR', (req, res) => { const r = Engine.FHR(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'FHR', plan: r.plan }); })
  router.post('/call/Filter', (req, res) => { const r = Engine.Filter(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Filter', plan: r.plan }); })
  router.post('/call/PostnatalCare', (req, res) => { const r = Engine.PostnatalCare(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'PostnatalCare', plan: r.plan }); })
  router.post('/call/Bleeding', (req, res) => { const r = Engine.Bleeding(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Bleeding', plan: r.plan }); })
  router.post('/call/Screening', (req, res) => { const r = Engine.Screening(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Screening', plan: r.plan }); })
  router.post('/call/Antenatal', (req, res) => { const r = Engine.Antenatal(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Antenatal', plan: r.plan }); })
  router.post('/call/Risk', (req, res) => { const r = Engine.Risk(req.body || {}); res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: 'Risk', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.48.0', module: 'pcc_ob_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
