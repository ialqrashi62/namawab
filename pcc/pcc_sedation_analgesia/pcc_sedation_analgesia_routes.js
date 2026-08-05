// P3-DL pcc_sedation_analgesia_routes v3.76.0
// P3-DL: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_sedation_analgesia_engine.js');
const VER = '3.76.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sedation_analgesia', label: 'PCC Sedation Analgesia', functions: Object.keys(F) });
});

router.post('/call/SedationScale', (req, res) => { const r = F.SedationScale(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'SedationScale', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AnalgesiaScore', (req, res) => { const r = F.AnalgesiaScore(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'AnalgesiaScore', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DailySedationInterruption', (req, res) => { const r = F.DailySedationInterruption(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'DailySedationInterruption', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Analgosedation', (req, res) => { const r = F.Analgosedation(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'Analgosedation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WithdrawalAssessment', (req, res) => { const r = F.WithdrawalAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'WithdrawalAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RegionalAnalgesia', (req, res) => { const r = F.RegionalAnalgesia(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'RegionalAnalgesia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OpioidSparing', (req, res) => { const r = F.OpioidSparing(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'OpioidSparing', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AgitationProtocol', (req, res) => { const r = F.AgitationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'AgitationProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ProceduralSedation', (req, res) => { const r = F.ProceduralSedation(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'ProceduralSedation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SedationWeaning', (req, res) => { const r = F.SedationWeaning(req.body || {}); res.json({ version: VER, module: 'pcc_sedation_analgesia', function: 'SedationWeaning', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_sedation_analgesia', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
