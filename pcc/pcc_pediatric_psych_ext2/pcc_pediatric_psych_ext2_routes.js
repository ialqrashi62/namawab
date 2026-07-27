// P3-EU pcc_pediatric_psych_ext2_routes v3.111.0
// P3-EU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_psych_ext2_engine.js');
const VER = '3.111.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', label: 'PCC Pediatric Psych Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricASDManagement', (req, res) => { const r = Engine.PediatricASDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricASDManagement', plan: r.plan }); });
router.post('/call/PediatricADHDManagement', (req, res) => { const r = Engine.PediatricADHDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricADHDManagement', plan: r.plan }); });
router.post('/call/PediatricAnxietyManagement', (req, res) => { const r = Engine.PediatricAnxietyManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricAnxietyManagement', plan: r.plan }); });
router.post('/call/PediatricDepressionManagement', (req, res) => { const r = Engine.PediatricDepressionManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricDepressionManagement', plan: r.plan }); });
router.post('/call/PediatricOCDManagement', (req, res) => { const r = Engine.PediatricOCDManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricOCDManagement', plan: r.plan }); });
router.post('/call/PediatricBipolarManagement', (req, res) => { const r = Engine.PediatricBipolarManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricBipolarManagement', plan: r.plan }); });
router.post('/call/PediatricTraumaTherapy', (req, res) => { const r = Engine.PediatricTraumaTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricTraumaTherapy', plan: r.plan }); });
router.post('/call/PediatricDBTEval', (req, res) => { const r = Engine.PediatricDBTEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricDBTEval', plan: r.plan }); });
router.post('/call/PediatricFamilyTherapy', (req, res) => { const r = Engine.PediatricFamilyTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricFamilyTherapy', plan: r.plan }); });
router.post('/call/PediatricGroupTherapy', (req, res) => { const r = Engine.PediatricGroupTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: 'PediatricGroupTherapy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_psych_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
