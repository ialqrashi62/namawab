// P3-DO pcc_hepatology_advanced_routes v3.79.0
// P3-DO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_hepatology_advanced_engine.js');
const VER = '3.79.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hepatology_advanced', label: 'PCC Hepatology Advanced', functions: Object.keys(F) });
});

router.post('/call/AscitesRefractory', (req, res) => { const r = F.AscitesRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AscitesRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HepaticEncephalopathyRecurrent', (req, res) => { const r = F.HepaticEncephalopathyRecurrent(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepaticEncephalopathyRecurrent', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HepatorenalSyndrome', (req, res) => { const r = F.HepatorenalSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepatorenalSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HepatopulmonarySyndrome', (req, res) => { const r = F.HepatopulmonarySyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepatopulmonarySyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PortopulmonaryHypertension', (req, res) => { const r = F.PortopulmonaryHypertension(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PortopulmonaryHypertension', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcuteLiverFailure', (req, res) => { const r = F.AcuteLiverFailure(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AcuteLiverFailure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoimmuneHepatitis', (req, res) => { const r = F.AutoimmuneHepatitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AutoimmuneHepatitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PrimaryBiliaryCholangitis', (req, res) => { const r = F.PrimaryBiliaryCholangitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PrimaryBiliaryCholangitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PrimarySclerosingCholangitis', (req, res) => { const r = F.PrimarySclerosingCholangitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PrimarySclerosingCholangitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LiverTransplantEvaluation', (req, res) => { const r = F.LiverTransplantEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'LiverTransplantEvaluation', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_hepatology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
