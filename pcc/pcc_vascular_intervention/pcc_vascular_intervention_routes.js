// pcc_vascular_intervention_routes v3.316.32 (Phase 1C)
'use strict';
const express = require('express');
const F = require('./pcc_vascular_intervention_engine.js');
const VER = '3.316.32';
const router = express.Router();
const FNS = ['CarotidStentPlacement','AAAEndovascularRepair','PeripheralAngioplasty','DVTThrombolysis','VaricoseVeinAblation','AVMEmbolization','RenalArteryStenting','MesentericIschemiaIntervention','ClaudicationRevascularization','VascularTraumaControl'];
router.get('/list', (req, res) => { res.json({ version: VER, module: 'pcc_vascular_intervention', label: 'PCC Vascular Intervention', functions: FNS }); });
const wrap = (n) => (req, res) => {
  try { const r = F[n](req.body || {}); res.json({ version: VER, module: 'pcc_vascular_intervention', function: n, result: r }); }
  catch (e) { res.status(400).json({ error: e.message, function: n }); }
};
FNS.forEach(n => router.post('/call/' + n, wrap(n)));
router.post('/record', (req, res) => {
  const { tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  if (!fn || !F[fn]) return res.status(400).json({ error: 'fn required and must be valid' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_vascular_intervention', function: fn, result: r, recorded: true, tenant_id, decisionId: decisionId || null });
});
module.exports = router;