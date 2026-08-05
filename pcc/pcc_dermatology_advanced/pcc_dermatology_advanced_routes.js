// P3-DQ pcc_dermatology_advanced_routes v3.81.0
// P3-DQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_dermatology_advanced_engine.js');
const VER = '3.81.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dermatology_advanced', label: 'PCC Dermatology Advanced', functions: Object.keys(F) });
});

router.post('/call/PsoriasisAdvanced', (req, res) => { const r = F.PsoriasisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'PsoriasisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AtopicDermatitisSevere', (req, res) => { const r = F.AtopicDermatitisSevere(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'AtopicDermatitisSevere', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcneRefractory', (req, res) => { const r = F.AcneRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'AcneRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RosaceaAdvanced', (req, res) => { const r = F.RosaceaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'RosaceaAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HidradenitisSuppurativa', (req, res) => { const r = F.HidradenitisSuppurativa(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'HidradenitisSuppurativa', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CutaneousLymphoma', (req, res) => { const r = F.CutaneousLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'CutaneousLymphoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneBlistering', (req, res) => { const r = F.AutoimmuneBlistering(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'AutoimmuneBlistering', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MelanomaAdvanced', (req, res) => { const r = F.MelanomaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'MelanomaAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DermatomyositisSkin', (req, res) => { const r = F.DermatomyositisSkin(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'DermatomyositisSkin', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularAnomalies', (req, res) => { const r = F.VascularAnomalies(req.body || {}); res.json({ version: VER, module: 'pcc_dermatology_advanced', function: 'VascularAnomalies', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_dermatology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
