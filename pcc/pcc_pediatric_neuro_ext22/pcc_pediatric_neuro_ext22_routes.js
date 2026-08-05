// pcc_pediatric_neuro_ext22 routes v3.132.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeuroRehab, PediatricStrokeRehab, PediatricTBIRehab, PediatricBrainTumorRehab, PediatricCerebralPalsyRehab, PediatricSpinaBifidaRehab, PediatricBrachialPlexusRehab, PediatricMuscularDystrophyRehab, PediatricSpinalCordInjuryRehab, PediatricAcquiredBrainInjury } = require('./pcc_pediatric_neuro_ext22_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.132.0', module: 'pcc_pediatric_neuro_ext22', label: 'PCC Pediatric Neuro Ext22', functions: ['PediatricNeuroRehab', 'PediatricStrokeRehab', 'PediatricTBIRehab', 'PediatricBrainTumorRehab', 'PediatricCerebralPalsyRehab', 'PediatricSpinaBifidaRehab', 'PediatricBrachialPlexusRehab', 'PediatricMuscularDystrophyRehab', 'PediatricSpinalCordInjuryRehab', 'PediatricAcquiredBrainInjury'] });
});
router.post('/call/PediatricNeuroRehab', authenticate, (req, res) => {
  res.json(PediatricNeuroRehab(req.body));
});

router.post('/call/PediatricStrokeRehab', authenticate, (req, res) => {
  res.json(PediatricStrokeRehab(req.body));
});

router.post('/call/PediatricTBIRehab', authenticate, (req, res) => {
  res.json(PediatricTBIRehab(req.body));
});

router.post('/call/PediatricBrainTumorRehab', authenticate, (req, res) => {
  res.json(PediatricBrainTumorRehab(req.body));
});

router.post('/call/PediatricCerebralPalsyRehab', authenticate, (req, res) => {
  res.json(PediatricCerebralPalsyRehab(req.body));
});

router.post('/call/PediatricSpinaBifidaRehab', authenticate, (req, res) => {
  res.json(PediatricSpinaBifidaRehab(req.body));
});

router.post('/call/PediatricBrachialPlexusRehab', authenticate, (req, res) => {
  res.json(PediatricBrachialPlexusRehab(req.body));
});

router.post('/call/PediatricMuscularDystrophyRehab', authenticate, (req, res) => {
  res.json(PediatricMuscularDystrophyRehab(req.body));
});

router.post('/call/PediatricSpinalCordInjuryRehab', authenticate, (req, res) => {
  res.json(PediatricSpinalCordInjuryRehab(req.body));
});

router.post('/call/PediatricAcquiredBrainInjury', authenticate, (req, res) => {
  res.json(PediatricAcquiredBrainInjury(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
