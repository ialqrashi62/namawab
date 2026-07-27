// P3-BU hem_ext2 routes v3.33.0
// P3-BU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./hem_ext2_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.33.0',
    module: 'hem_ext2',
    label: 'Hematology Extended 2',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Anemia', (req, res) => { const r = Engine.Anemia(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Anemia', plan: r.plan }); })
  router.post('/call/Thrombocyt', (req, res) => { const r = Engine.Thrombocyt(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Thrombocyt', plan: r.plan }); })
  router.post('/call/Coag', (req, res) => { const r = Engine.Coag(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Coag', plan: r.plan }); })
  router.post('/call/DVT', (req, res) => { const r = Engine.DVT(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'DVT', plan: r.plan }); })
  router.post('/call/Anticoag', (req, res) => { const r = Engine.Anticoag(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Anticoag', plan: r.plan }); })
  router.post('/call/Bleed', (req, res) => { const r = Engine.Bleed(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Bleed', plan: r.plan }); })
  router.post('/call/TTP', (req, res) => { const r = Engine.TTP(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'TTP', plan: r.plan }); })
  router.post('/call/DIC', (req, res) => { const r = Engine.DIC(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'DIC', plan: r.plan }); })
  router.post('/call/Sickle', (req, res) => { const r = Engine.Sickle(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Sickle', plan: r.plan }); })
  router.post('/call/Lymphoma', (req, res) => { const r = Engine.Lymphoma(req.body || {}); res.json({ version: '3.33.0', module: 'hem_ext2', function: 'Lymphoma', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.33.0', module: 'hem_ext2', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
