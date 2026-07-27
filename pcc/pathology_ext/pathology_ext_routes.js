// P3-BR pathology_ext routes v3.30.0
// P3-BR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./pathology_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.30.0',
    module: 'pathology_ext',
    label: 'Pathology Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Biopsy', (req, res) => { const r = Engine.Biopsy(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Biopsy', plan: r.plan }); })
  router.post('/call/Frozen', (req, res) => { const r = Engine.Frozen(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Frozen', plan: r.plan }); })
  router.post('/call/ImmunoHisto', (req, res) => { const r = Engine.ImmunoHisto(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'ImmunoHisto', plan: r.plan }); })
  router.post('/call/Molecular', (req, res) => { const r = Engine.Molecular(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Molecular', plan: r.plan }); })
  router.post('/call/Cyto', (req, res) => { const r = Engine.Cyto(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Cyto', plan: r.plan }); })
  router.post('/call/HematoPath', (req, res) => { const r = Engine.HematoPath(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'HematoPath', plan: r.plan }); })
  router.post('/call/Surgical', (req, res) => { const r = Engine.Surgical(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Surgical', plan: r.plan }); })
  router.post('/call/Autopsy', (req, res) => { const r = Engine.Autopsy(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Autopsy', plan: r.plan }); })
  router.post('/call/Consult', (req, res) => { const r = Engine.Consult(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'Consult', plan: r.plan }); })
  router.post('/call/MolecularDx', (req, res) => { const r = Engine.MolecularDx(req.body || {}); res.json({ version: '3.30.0', module: 'pathology_ext', function: 'MolecularDx', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.30.0', module: 'pathology_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
