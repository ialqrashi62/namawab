// Routes for pcc_auto_ext_327 — 3.301.0
"use strict";
const express = require('express');
const router = express.Router();
const Engine = require('./pcc_auto_ext_327_engine.js');
const VER = '3.301.0';
const MOD = 'pcc_auto_ext_327';
const LABEL = 'Auto Ext 327';

router.get('/list', (req, res) => { res.json({ version: VER, module: MOD, label: LABEL, functions: Object.keys(Engine) }); });
router.post('/call/:fn', (req, res) => {
  const fn = req.params.fn;
  if (!Engine[fn]) return res.status(404).json({ error: 'unknown function: ' + fn });
  try { res.json(Engine[fn](req.body || {})); } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/record', (req, res) => {
  const { tenant_id, encounter_id, fn, input, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  if (!fn || !Engine[fn]) return res.status(400).json({ error: 'fn required and must be valid' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: MOD, function: fn, encounter_id, tenant_id, result: r, recorded: true, created_by, ts: r.ts });
});
module.exports = router;
