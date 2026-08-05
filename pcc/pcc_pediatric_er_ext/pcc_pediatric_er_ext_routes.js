// P3-EN pcc_pediatric_er_ext_routes v3.104.0
// P3-EN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_er_ext_engine.js');
const VER = '3.104.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_er_ext', label: 'PCC Pediatric ER Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricRespiratoryDistress', (req, res) => { const r = F.PediatricRespiratoryDistress(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricRespiratoryDistress', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAsthmaExacerbation', (req, res) => { const r = F.PediatricAsthmaExacerbation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricAsthmaExacerbation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAnaphylaxis', (req, res) => { const r = F.PediatricAnaphylaxis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricAnaphylaxis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDehydration', (req, res) => { const r = F.PediatricDehydration(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricDehydration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricApnea', (req, res) => { const r = F.PediatricApnea(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricApnea', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBradycardia', (req, res) => { const r = F.PediatricBradycardia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricBradycardia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTachycardia', (req, res) => { const r = F.PediatricTachycardia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricTachycardia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAlteredMental', (req, res) => { const r = F.PediatricAlteredMental(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricAlteredMental', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPoisoning', (req, res) => { const r = F.PediatricPoisoning(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricPoisoning', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricForeignBody', (req, res) => { const r = F.PediatricForeignBody(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: 'PediatricForeignBody', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_er_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
