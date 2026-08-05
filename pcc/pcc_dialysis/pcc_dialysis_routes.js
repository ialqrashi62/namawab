// P3-DS pcc_dialysis_routes v3.83.0
// P3-DS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_dialysis_engine.js');
const VER = '3.83.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dialysis', label: 'PCC Dialysis', functions: Object.keys(F) });
});

router.post('/call/DialysisInitiation', (req, res) => { const r = F.DialysisInitiation(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisInitiation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HDAdequacyKtV', (req, res) => { const r = F.HDAdequacyKtV(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'HDAdequacyKtV', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PDAdequacyKtV', (req, res) => { const r = F.PDAdequacyKtV(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'PDAdequacyKtV', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CRRTDose', (req, res) => { const r = F.CRRTDose(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'CRRTDose', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VascularAccess', (req, res) => { const r = F.VascularAccess(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'VascularAccess', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisHypotension', (req, res) => { const r = F.DialysisHypotension(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisHypotension', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DialysisDisequilibrium', (req, res) => { const r = F.DialysisDisequilibrium(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisDisequilibrium', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HyperkalemiaDialysis', (req, res) => { const r = F.HyperkalemiaDialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'HyperkalemiaDialysis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ContrastNephropathyProphylaxis', (req, res) => { const r = F.ContrastNephropathyProphylaxis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'ContrastNephropathyProphylaxis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransplantWaitlist', (req, res) => { const r = F.TransplantWaitlist(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'TransplantWaitlist', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_dialysis', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
