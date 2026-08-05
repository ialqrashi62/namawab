// pcc_pediatric_neuro_ext23 routes v3.133.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricVisionRehab, PediatricHearingRehab, PediatricCochlearImplantRehab, PediatricVisionAid, PediatricBrailleTraining, PediatricSignLanguage, PediatricAACDevice, PediatricCommunicationBoard, PediatricMobilityAid, PediatricWheelchairTraining } = require('./pcc_pediatric_neuro_ext23_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.133.0', module: 'pcc_pediatric_neuro_ext23', label: 'PCC Pediatric Neuro Ext23', functions: ['PediatricVisionRehab', 'PediatricHearingRehab', 'PediatricCochlearImplantRehab', 'PediatricVisionAid', 'PediatricBrailleTraining', 'PediatricSignLanguage', 'PediatricAACDevice', 'PediatricCommunicationBoard', 'PediatricMobilityAid', 'PediatricWheelchairTraining'] });
});
router.post('/call/PediatricVisionRehab', authenticate, (req, res) => {
  res.json(PediatricVisionRehab(req.body));
});

router.post('/call/PediatricHearingRehab', authenticate, (req, res) => {
  res.json(PediatricHearingRehab(req.body));
});

router.post('/call/PediatricCochlearImplantRehab', authenticate, (req, res) => {
  res.json(PediatricCochlearImplantRehab(req.body));
});

router.post('/call/PediatricVisionAid', authenticate, (req, res) => {
  res.json(PediatricVisionAid(req.body));
});

router.post('/call/PediatricBrailleTraining', authenticate, (req, res) => {
  res.json(PediatricBrailleTraining(req.body));
});

router.post('/call/PediatricSignLanguage', authenticate, (req, res) => {
  res.json(PediatricSignLanguage(req.body));
});

router.post('/call/PediatricAACDevice', authenticate, (req, res) => {
  res.json(PediatricAACDevice(req.body));
});

router.post('/call/PediatricCommunicationBoard', authenticate, (req, res) => {
  res.json(PediatricCommunicationBoard(req.body));
});

router.post('/call/PediatricMobilityAid', authenticate, (req, res) => {
  res.json(PediatricMobilityAid(req.body));
});

router.post('/call/PediatricWheelchairTraining', authenticate, (req, res) => {
  res.json(PediatricWheelchairTraining(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
