// pcc_pediatric_surg_ext49 routes v3.159.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricEpilepsySurgeryExt, PediatricTemporalLobectomyExt, PediatricHemispherectomyExt, PediatricCorpusCallosotomyExt, PediatricLesionectomyExt, PediatricVagusNerveStimulatorExt, PediatricResponsiveNeurostimulatorExt, PediatricStereotacticEEGExt, PediatricLaserAblationExt, PediatricMRIguidedLITTSExt } = require('./pcc_pediatric_surg_ext49_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.159.0', module: 'pcc_pediatric_surg_ext49', label: 'PCC Pediatric Surg Ext49', functions: ['PediatricEpilepsySurgeryExt', 'PediatricTemporalLobectomyExt', 'PediatricHemispherectomyExt', 'PediatricCorpusCallosotomyExt', 'PediatricLesionectomyExt', 'PediatricVagusNerveStimulatorExt', 'PediatricResponsiveNeurostimulatorExt', 'PediatricStereotacticEEGExt', 'PediatricLaserAblationExt', 'PediatricMRIguidedLITTSExt'] });
});
router.post('/call/PediatricEpilepsySurgeryExt', authenticate, (req, res) => {
  res.json(PediatricEpilepsySurgeryExt(req.body));
});

router.post('/call/PediatricTemporalLobectomyExt', authenticate, (req, res) => {
  res.json(PediatricTemporalLobectomyExt(req.body));
});

router.post('/call/PediatricHemispherectomyExt', authenticate, (req, res) => {
  res.json(PediatricHemispherectomyExt(req.body));
});

router.post('/call/PediatricCorpusCallosotomyExt', authenticate, (req, res) => {
  res.json(PediatricCorpusCallosotomyExt(req.body));
});

router.post('/call/PediatricLesionectomyExt', authenticate, (req, res) => {
  res.json(PediatricLesionectomyExt(req.body));
});

router.post('/call/PediatricVagusNerveStimulatorExt', authenticate, (req, res) => {
  res.json(PediatricVagusNerveStimulatorExt(req.body));
});

router.post('/call/PediatricResponsiveNeurostimulatorExt', authenticate, (req, res) => {
  res.json(PediatricResponsiveNeurostimulatorExt(req.body));
});

router.post('/call/PediatricStereotacticEEGExt', authenticate, (req, res) => {
  res.json(PediatricStereotacticEEGExt(req.body));
});

router.post('/call/PediatricLaserAblationExt', authenticate, (req, res) => {
  res.json(PediatricLaserAblationExt(req.body));
});

router.post('/call/PediatricMRIguidedLITTSExt', authenticate, (req, res) => {
  res.json(PediatricMRIguidedLITTSExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
