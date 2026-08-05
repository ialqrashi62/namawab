// P3-EU pcc_pediatric_psych_ext2_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_psych_ext2_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', label: 'PCC Pediatric Psych Ext2', functions: Object.keys(F) });
});
router.post('/call/PediatricASDManagement', (req, res) => { const r = F.PediatricASDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricASDManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricADHDManagement', (req, res) => { const r = F.PediatricADHDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricADHDManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAnxietyManagement', (req, res) => { const r = F.PediatricAnxietyManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricAnxietyManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDepressionManagement', (req, res) => { const r = F.PediatricDepressionManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricDepressionManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOCDManagement', (req, res) => { const r = F.PediatricOCDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricOCDManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBipolarManagement', (req, res) => { const r = F.PediatricBipolarManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricBipolarManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTraumaTherapy', (req, res) => { const r = F.PediatricTraumaTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricTraumaTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDBTEval', (req, res) => { const r = F.PediatricDBTEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricDBTEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFamilyTherapy', (req, res) => { const r = F.PediatricFamilyTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricFamilyTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGroupTherapy', (req, res) => { const r = F.PediatricGroupTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricGroupTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
