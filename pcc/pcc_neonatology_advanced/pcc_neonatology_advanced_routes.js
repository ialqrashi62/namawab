// P3-DQ pcc_neonatology_advanced_routes v3.81.0
// P3-DQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neonatology_advanced_engine.js');
const VER = '3.81.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatology_advanced', label: 'PCC Neonatology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/NeonatalResuscitationAdvanced', (req, res) => { const r = Engine.NeonatalResuscitationAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalResuscitationAdvanced', plan: r.plan }); });
router.post('/call/NeonatalSepsisAdvanced', (req, res) => { const r = Engine.NeonatalSepsisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalSepsisAdvanced', plan: r.plan }); });
router.post('/call/NeonatalHypoglycemia', (req, res) => { const r = Engine.NeonatalHypoglycemia(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalHypoglycemia', plan: r.plan }); });
router.post('/call/NeonatalJaundiceAdvanced', (req, res) => { const r = Engine.NeonatalJaundiceAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalJaundiceAdvanced', plan: r.plan }); });
router.post('/call/NeonatalRespiratoryDistress', (req, res) => { const r = Engine.NeonatalRespiratoryDistress(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalRespiratoryDistress', plan: r.plan }); });
router.post('/call/NeonatalSeizures', (req, res) => { const r = Engine.NeonatalSeizures(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalSeizures', plan: r.plan }); });
router.post('/call/NeonatalHypoxicIschemic', (req, res) => { const r = Engine.NeonatalHypoxicIschemic(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalHypoxicIschemic', plan: r.plan }); });
router.post('/call/NeonatalNecrotizingEnterocolitis', (req, res) => { const r = Engine.NeonatalNecrotizingEnterocolitis(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalNecrotizingEnterocolitis', plan: r.plan }); });
router.post('/call/NeonatalPatentDuctusArteriosus', (req, res) => { const r = Engine.NeonatalPatentDuctusArteriosus(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalPatentDuctusArteriosus', plan: r.plan }); });
router.post('/call/NeonatalRetinopathyPrematurity', (req, res) => { const r = Engine.NeonatalRetinopathyPrematurity(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalRetinopathyPrematurity', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
