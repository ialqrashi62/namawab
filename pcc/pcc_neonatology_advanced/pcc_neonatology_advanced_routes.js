// P3-DQ pcc_neonatology_advanced_routes v3.81.0
// P3-DQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neonatology_advanced_engine.js');
const VER = '3.81.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatology_advanced', label: 'PCC Neonatology Advanced', functions: Object.keys(F) });
});

router.post('/call/NeonatalResuscitationAdvanced', (req, res) => { const r = F.NeonatalResuscitationAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalResuscitationAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalSepsisAdvanced', (req, res) => { const r = F.NeonatalSepsisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalSepsisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalHypoglycemia', (req, res) => { const r = F.NeonatalHypoglycemia(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalHypoglycemia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalJaundiceAdvanced', (req, res) => { const r = F.NeonatalJaundiceAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalJaundiceAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalRespiratoryDistress', (req, res) => { const r = F.NeonatalRespiratoryDistress(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalRespiratoryDistress', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalSeizures', (req, res) => { const r = F.NeonatalSeizures(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalSeizures', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalHypoxicIschemic', (req, res) => { const r = F.NeonatalHypoxicIschemic(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalHypoxicIschemic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalNecrotizingEnterocolitis', (req, res) => { const r = F.NeonatalNecrotizingEnterocolitis(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalNecrotizingEnterocolitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalPatentDuctusArteriosus', (req, res) => { const r = F.NeonatalPatentDuctusArteriosus(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalPatentDuctusArteriosus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalRetinopathyPrematurity', (req, res) => { const r = F.NeonatalRetinopathyPrematurity(req.body || {}); res.json({ version: VER, module: 'pcc_neonatology_advanced', function: 'NeonatalRetinopathyPrematurity', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
