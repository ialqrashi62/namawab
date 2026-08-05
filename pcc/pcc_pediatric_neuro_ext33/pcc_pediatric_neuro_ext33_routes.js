// pcc_pediatric_neuro_ext33 routes v3.143.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricLearningDisorderExt3, PediatricDyslexiaExt, PediatricDyscalculiaExt, PediatricDysgraphiaExt, PediatricAuditoryProcessingExt, PediatricVisualProcessingExt, PediatricLanguageDisorderExt, PediatricSpeechSoundDisorderExt, PediatricChildhoodFluencyExt, PediatricSocialCommunicationExt } = require('./pcc_pediatric_neuro_ext33_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.143.0', module: 'pcc_pediatric_neuro_ext33', label: 'PCC Pediatric Neuro Ext33', functions: ['PediatricLearningDisorderExt3', 'PediatricDyslexiaExt', 'PediatricDyscalculiaExt', 'PediatricDysgraphiaExt', 'PediatricAuditoryProcessingExt', 'PediatricVisualProcessingExt', 'PediatricLanguageDisorderExt', 'PediatricSpeechSoundDisorderExt', 'PediatricChildhoodFluencyExt', 'PediatricSocialCommunicationExt'] });
});
router.post('/call/PediatricLearningDisorderExt3', authenticate, (req, res) => {
  res.json(PediatricLearningDisorderExt3(req.body));
});

router.post('/call/PediatricDyslexiaExt', authenticate, (req, res) => {
  res.json(PediatricDyslexiaExt(req.body));
});

router.post('/call/PediatricDyscalculiaExt', authenticate, (req, res) => {
  res.json(PediatricDyscalculiaExt(req.body));
});

router.post('/call/PediatricDysgraphiaExt', authenticate, (req, res) => {
  res.json(PediatricDysgraphiaExt(req.body));
});

router.post('/call/PediatricAuditoryProcessingExt', authenticate, (req, res) => {
  res.json(PediatricAuditoryProcessingExt(req.body));
});

router.post('/call/PediatricVisualProcessingExt', authenticate, (req, res) => {
  res.json(PediatricVisualProcessingExt(req.body));
});

router.post('/call/PediatricLanguageDisorderExt', authenticate, (req, res) => {
  res.json(PediatricLanguageDisorderExt(req.body));
});

router.post('/call/PediatricSpeechSoundDisorderExt', authenticate, (req, res) => {
  res.json(PediatricSpeechSoundDisorderExt(req.body));
});

router.post('/call/PediatricChildhoodFluencyExt', authenticate, (req, res) => {
  res.json(PediatricChildhoodFluencyExt(req.body));
});

router.post('/call/PediatricSocialCommunicationExt', authenticate, (req, res) => {
  res.json(PediatricSocialCommunicationExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
