// pcc_pediatric_surg_ext46 routes v3.156.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricNeurosurgeryOncologyExt, PediatricSpinalTumorExt, PediatricPosteriorFossaTumorExt, PediatricBrainstemTumorExt, PediatricSuprasellarTumorExt, PediatricPituitaryTumorExt, PediatricPinealRegionTumorExt, PediatricSpinalCordTumorExt, PediatricPeripheralNerveTumorExt, PediatricSkullBaseTumorExt } = require('./pcc_pediatric_surg_ext46_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.156.0', module: 'pcc_pediatric_surg_ext46', label: 'PCC Pediatric Surg Ext46', functions: ['PediatricNeurosurgeryOncologyExt', 'PediatricSpinalTumorExt', 'PediatricPosteriorFossaTumorExt', 'PediatricBrainstemTumorExt', 'PediatricSuprasellarTumorExt', 'PediatricPituitaryTumorExt', 'PediatricPinealRegionTumorExt', 'PediatricSpinalCordTumorExt', 'PediatricPeripheralNerveTumorExt', 'PediatricSkullBaseTumorExt'] });
});
router.post('/call/PediatricNeurosurgeryOncologyExt', authenticate, (req, res) => {
  res.json(PediatricNeurosurgeryOncologyExt(req.body));
});

router.post('/call/PediatricSpinalTumorExt', authenticate, (req, res) => {
  res.json(PediatricSpinalTumorExt(req.body));
});

router.post('/call/PediatricPosteriorFossaTumorExt', authenticate, (req, res) => {
  res.json(PediatricPosteriorFossaTumorExt(req.body));
});

router.post('/call/PediatricBrainstemTumorExt', authenticate, (req, res) => {
  res.json(PediatricBrainstemTumorExt(req.body));
});

router.post('/call/PediatricSuprasellarTumorExt', authenticate, (req, res) => {
  res.json(PediatricSuprasellarTumorExt(req.body));
});

router.post('/call/PediatricPituitaryTumorExt', authenticate, (req, res) => {
  res.json(PediatricPituitaryTumorExt(req.body));
});

router.post('/call/PediatricPinealRegionTumorExt', authenticate, (req, res) => {
  res.json(PediatricPinealRegionTumorExt(req.body));
});

router.post('/call/PediatricSpinalCordTumorExt', authenticate, (req, res) => {
  res.json(PediatricSpinalCordTumorExt(req.body));
});

router.post('/call/PediatricPeripheralNerveTumorExt', authenticate, (req, res) => {
  res.json(PediatricPeripheralNerveTumorExt(req.body));
});

router.post('/call/PediatricSkullBaseTumorExt', authenticate, (req, res) => {
  res.json(PediatricSkullBaseTumorExt(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
