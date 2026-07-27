// P3-DS pcc_dialysis_routes v3.83.0
// P3-DS: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_dialysis_engine.js');
const VER = '3.83.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_dialysis', label: 'PCC Dialysis', functions: Object.keys(Engine) });
});

router.post('/call/DialysisInitiation', (req, res) => { const r = Engine.DialysisInitiation(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisInitiation', plan: r.plan }); });
router.post('/call/HDAdequacyKtV', (req, res) => { const r = Engine.HDAdequacyKtV(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'HDAdequacyKtV', plan: r.plan }); });
router.post('/call/PDAdequacyKtV', (req, res) => { const r = Engine.PDAdequacyKtV(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'PDAdequacyKtV', plan: r.plan }); });
router.post('/call/CRRTDose', (req, res) => { const r = Engine.CRRTDose(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'CRRTDose', plan: r.plan }); });
router.post('/call/VascularAccess', (req, res) => { const r = Engine.VascularAccess(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'VascularAccess', plan: r.plan }); });
router.post('/call/DialysisHypotension', (req, res) => { const r = Engine.DialysisHypotension(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisHypotension', plan: r.plan }); });
router.post('/call/DialysisDisequilibrium', (req, res) => { const r = Engine.DialysisDisequilibrium(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'DialysisDisequilibrium', plan: r.plan }); });
router.post('/call/HyperkalemiaDialysis', (req, res) => { const r = Engine.HyperkalemiaDialysis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'HyperkalemiaDialysis', plan: r.plan }); });
router.post('/call/ContrastNephropathyProphylaxis', (req, res) => { const r = Engine.ContrastNephropathyProphylaxis(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'ContrastNephropathyProphylaxis', plan: r.plan }); });
router.post('/call/TransplantWaitlist', (req, res) => { const r = Engine.TransplantWaitlist(req.body || {}); res.json({ version: VER, module: 'pcc_dialysis', function: 'TransplantWaitlist', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_dialysis', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
