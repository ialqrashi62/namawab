// pcc_cath_lab_specialized_routes v3.316.32 (Phase 1D)
'use strict';
const express = require('express');
const F = require('./pcc_cath_lab_specialized_engine.js');
const VER = '3.316.32';
const router = express.Router();
const FNS = ['CTOScoreJCTO','SyntaxScore','CalciumScoreIVUS','FFRiFRAnalysis','BifurcationMedina','PerforationEllis','RotablationBurr','IVLDelivery','NoReflowPredict','CoronaryDissectionType'];
router.get('/list', (req, res) => { res.json({ version: VER, module: 'pcc_cath_lab_specialized', label: 'PCC Cath Lab Specialized', functions: FNS }); });
const wrap = (n) => (req, res) => { try { const r = F[n](req.body || {}); res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: n, result: r }); } catch (e) { res.status(400).json({ error: e.message, function: n }); } };
FNS.forEach(n => router.post('/call/' + n, wrap(n)));
router.post('/record', (req, res) => {
  const { tenant_id, decisionId, input, fn } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  if (!fn || !F[fn]) return res.status(400).json({ error: 'fn required and must be valid' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_cath_lab_specialized', function: fn, result: r, recorded: true, tenant_id, decisionId: decisionId || null });
});
module.exports = router;