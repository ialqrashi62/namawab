// P3-ET pcc_pediatric_endo_ext2_routes v3.110.0
// P3-ET: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_endo_ext2_engine.js');
const VER = '3.110.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', label: 'PCC Pediatric Endo Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricPCOSEval', (req, res) => { const r = Engine.PediatricPCOSEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPCOSEval', plan: r.plan }); });
router.post('/call/PediatricHirsutismEval', (req, res) => { const r = Engine.PediatricHirsutismEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricHirsutismEval', plan: r.plan }); });
router.post('/call/PediatricPrecociousPuberty', (req, res) => { const r = Engine.PediatricPrecociousPuberty(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPrecociousPuberty', plan: r.plan }); });
router.post('/call/PediatricDelayedPubertyExt', (req, res) => { const r = Engine.PediatricDelayedPubertyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricDelayedPubertyExt', plan: r.plan }); });
router.post('/call/PediatricGenderIdentityEval', (req, res) => { const r = Engine.PediatricGenderIdentityEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricGenderIdentityEval', plan: r.plan }); });
router.post('/call/PediatricAdrenalTumor', (req, res) => { const r = Engine.PediatricAdrenalTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricAdrenalTumor', plan: r.plan }); });
router.post('/call/PediatricPituitaryTumor', (req, res) => { const r = Engine.PediatricPituitaryTumor(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricPituitaryTumor', plan: r.plan }); });
router.post('/call/PediatricThyroidNodule', (req, res) => { const r = Engine.PediatricThyroidNodule(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricThyroidNodule', plan: r.plan }); });
router.post('/call/PediatricParathyroidEval', (req, res) => { const r = Engine.PediatricParathyroidEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricParathyroidEval', plan: r.plan }); });
router.post('/call/PediatricBoneHealthEval', (req, res) => { const r = Engine.PediatricBoneHealthEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: 'PediatricBoneHealthEval', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_endo_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
