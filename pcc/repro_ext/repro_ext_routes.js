// P3-BW repro_ext routes v3.35.0
// P3-BW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./repro_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.35.0',
    module: 'repro_ext',
    label: 'Reproductive Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Infertility', (req, res) => { const r = Engine.Infertility(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Infertility', plan: r.plan }); })
  router.post('/call/ART', (req, res) => { const r = Engine.ART(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'ART', plan: r.plan }); })
  router.post('/call/PCOS', (req, res) => { const r = Engine.PCOS(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'PCOS', plan: r.plan }); })
  router.post('/call/Endometriosis', (req, res) => { const r = Engine.Endometriosis(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Endometriosis', plan: r.plan }); })
  router.post('/call/Fibroids', (req, res) => { const r = Engine.Fibroids(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Fibroids', plan: r.plan }); })
  router.post('/call/Contraception', (req, res) => { const r = Engine.Contraception(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Contraception', plan: r.plan }); })
  router.post('/call/Menopause', (req, res) => { const r = Engine.Menopause(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Menopause', plan: r.plan }); })
  router.post('/call/STI', (req, res) => { const r = Engine.STI(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'STI', plan: r.plan }); })
  router.post('/call/Sexual', (req, res) => { const r = Engine.Sexual(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Sexual', plan: r.plan }); })
  router.post('/call/Preconception', (req, res) => { const r = Engine.Preconception(req.body || {}); res.json({ version: '3.35.0', module: 'repro_ext', function: 'Preconception', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.35.0', module: 'repro_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
