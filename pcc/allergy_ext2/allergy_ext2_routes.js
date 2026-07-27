// P3-BY allergy_ext2 routes v3.37.0
// P3-BY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./allergy_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.37.0',
    module: 'allergy_ext2',
    label: 'Allergy Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Rhinitis', (req, res) => { const r = Engine.Rhinitis(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Rhinitis', plan: r.plan }); })
  router.post('/call/Asthma', (req, res) => { const r = Engine.Asthma(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Asthma', plan: r.plan }); })
  router.post('/call/Food', (req, res) => { const r = Engine.Food(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Food', plan: r.plan }); })
  router.post('/call/Drug', (req, res) => { const r = Engine.Drug(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Drug', plan: r.plan }); })
  router.post('/call/Urticaria', (req, res) => { const r = Engine.Urticaria(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Urticaria', plan: r.plan }); })
  router.post('/call/Anaphylaxis', (req, res) => { const r = Engine.Anaphylaxis(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Anaphylaxis', plan: r.plan }); })
  router.post('/call/Sting', (req, res) => { const r = Engine.Sting(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Sting', plan: r.plan }); })
  router.post('/call/Eczema', (req, res) => { const r = Engine.Eczema(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Eczema', plan: r.plan }); })
  router.post('/call/Contact', (req, res) => { const r = Engine.Contact(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'Contact', plan: r.plan }); })
  router.post('/call/AIT', (req, res) => { const r = Engine.AIT(req.body || {}); res.json({ version: '3.37.0', module: 'allergy_ext2', function: 'AIT', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.37.0', module: 'allergy_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
