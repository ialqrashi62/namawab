// P3-BQ plast_surg_ext routes v3.29.0
// P3-BQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
const express = require('express');
const Engine = require('./plast_surg_ext_engine.js');
const router = express.Router();
router.get('/list', (req, res) => {
  res.json({
    version: '3.29.0',
    module: 'plast_surg_ext',
    label: 'Plastic Surgery Extended',
    functions: Object.keys(Engine),
  });
});
  router.post('/call/Burn', (req, res) => { const r = Engine.Burn(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Burn', plan: r.plan }); })
  router.post('/call/Wound', (req, res) => { const r = Engine.Wound(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Wound', plan: r.plan }); })
  router.post('/call/Reconstruct', (req, res) => { const r = Engine.Reconstruct(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Reconstruct', plan: r.plan }); })
  router.post('/call/Hand', (req, res) => { const r = Engine.Hand(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Hand', plan: r.plan }); })
  router.post('/call/Cosmetic', (req, res) => { const r = Engine.Cosmetic(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Cosmetic', plan: r.plan }); })
  router.post('/call/SkinCancer', (req, res) => { const r = Engine.SkinCancer(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'SkinCancer', plan: r.plan }); })
  router.post('/call/Cleft', (req, res) => { const r = Engine.Cleft(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Cleft', plan: r.plan }); })
  router.post('/call/Lymphedema', (req, res) => { const r = Engine.Lymphedema(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'Lymphedema', plan: r.plan }); })
  router.post('/call/PressureUlcer', (req, res) => { const r = Engine.PressureUlcer(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'PressureUlcer', plan: r.plan }); })
  router.post('/call/TraumaRecon', (req, res) => { const r = Engine.TraumaRecon(req.body || {}); res.json({ version: '3.29.0', module: 'plast_surg_ext', function: 'TraumaRecon', plan: r.plan }); })
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: '3.29.0', module: 'plast_surg_ext', function: fn, plan: r.plan, recorded: true });
});
module.exports = router;
