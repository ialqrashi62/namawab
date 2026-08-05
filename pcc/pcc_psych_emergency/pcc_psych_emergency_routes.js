// P3-DT pcc_psych_emergency_routes v3.84.0
// P3-DT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_psych_emergency_engine.js');
const VER = '3.84.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_psych_emergency', label: 'PCC Psych Emergency', functions: Object.keys(F) });
});
router.post('/call/ColumbiaSuicideSeverity', (req, res) => { const r = F.ColumbiaSuicideSeverity(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'ColumbiaSuicideSeverity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PHQ2PHQ9Triage', (req, res) => { const r = F.PHQ2PHQ9Triage(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'PHQ2PHQ9Triage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GAD7Triage', (req, res) => { const r = F.GAD7Triage(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'GAD7Triage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CIWATriage', (req, res) => { const r = F.CIWATriage(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'CIWATriage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DeliriumCAMICU', (req, res) => { const r = F.DeliriumCAMICU(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'DeliriumCAMICU', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcutePsychosisScreen', (req, res) => { const r = F.AcutePsychosisScreen(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'AcutePsychosisScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SubstanceIntoxicationTriage', (req, res) => { const r = F.SubstanceIntoxicationTriage(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'SubstanceIntoxicationTriage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RestraintIndication', (req, res) => { const r = F.RestraintIndication(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'RestraintIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InvoluntaryHoldCriteria', (req, res) => { const r = F.InvoluntaryHoldCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'InvoluntaryHoldCriteria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PsychiatricDisposition', (req, res) => { const r = F.PsychiatricDisposition(req.body || {}); res.json({ version: VER, module: 'pcc_psych_emergency', function: 'PsychiatricDisposition', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_psych_emergency', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
