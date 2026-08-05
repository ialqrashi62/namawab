// P3-ET pcc_pediatric_endo_ext2_routes v3.110.0
// P3-ET: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_endo_ext2_engine.js');
const VER = '3.110.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', label: 'PCC Pediatric Endo Ext2', functions: Object.keys(F) });
});
router.post('/call/PediatricPCOSEval', (req, res) => { const r = F.PediatricPCOSEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPCOSEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHirsutismEval', (req, res) => { const r = F.PediatricHirsutismEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricHirsutismEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPrecociousPuberty', (req, res) => { const r = F.PediatricPrecociousPuberty(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPrecociousPuberty', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDelayedPubertyExt', (req, res) => { const r = F.PediatricDelayedPubertyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricDelayedPubertyExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGenderIdentityEval', (req, res) => { const r = F.PediatricGenderIdentityEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricGenderIdentityEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAdrenalTumor', (req, res) => { const r = F.PediatricAdrenalTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricAdrenalTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPituitaryTumor', (req, res) => { const r = F.PediatricPituitaryTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPituitaryTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricThyroidNodule', (req, res) => { const r = F.PediatricThyroidNodule(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricThyroidNodule', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricParathyroidEval', (req, res) => { const r = F.PediatricParathyroidEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricParathyroidEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBoneHealthEval', (req, res) => { const r = F.PediatricBoneHealthEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricBoneHealthEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
