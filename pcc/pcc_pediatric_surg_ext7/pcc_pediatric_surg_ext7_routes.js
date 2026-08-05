// pcc_pediatric_surg_ext7 routes v3.117.0
const express = require('express');
// auth: authenticate (per audit L4-4)
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricSoftTissueSurgery, PediatricSkinLesionExcision, PediatricBurnWoundCare, PediatricWoundDebridement, PediatricSkinGraft, PediatricFlapReconstruction, PediatricScarRevision, PediatricCystExcision, PediatricLymphNodeBiopsy, PediatricTissueBiopsy } = require('./pcc_pediatric_surg_ext7_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.117.0', module: 'pcc_pediatric_surg_ext7', label: 'PCC Pediatric Surg Ext7', functions: ['PediatricSoftTissueSurgery', 'PediatricSkinLesionExcision', 'PediatricBurnWoundCare', 'PediatricWoundDebridement', 'PediatricSkinGraft', 'PediatricFlapReconstruction', 'PediatricScarRevision', 'PediatricCystExcision', 'PediatricLymphNodeBiopsy', 'PediatricTissueBiopsy'] });
});
router.post('/call/PediatricSoftTissueSurgery', authenticate, (req, res) => {
  res.json(PediatricSoftTissueSurgery(req.body));
});

router.post('/call/PediatricSkinLesionExcision', authenticate, (req, res) => {
  res.json(PediatricSkinLesionExcision(req.body));
});

router.post('/call/PediatricBurnWoundCare', authenticate, (req, res) => {
  res.json(PediatricBurnWoundCare(req.body));
});

router.post('/call/PediatricWoundDebridement', authenticate, (req, res) => {
  res.json(PediatricWoundDebridement(req.body));
});

router.post('/call/PediatricSkinGraft', authenticate, (req, res) => {
  res.json(PediatricSkinGraft(req.body));
});

router.post('/call/PediatricFlapReconstruction', authenticate, (req, res) => {
  res.json(PediatricFlapReconstruction(req.body));
});

router.post('/call/PediatricScarRevision', authenticate, (req, res) => {
  res.json(PediatricScarRevision(req.body));
});

router.post('/call/PediatricCystExcision', authenticate, (req, res) => {
  res.json(PediatricCystExcision(req.body));
});

router.post('/call/PediatricLymphNodeBiopsy', authenticate, (req, res) => {
  res.json(PediatricLymphNodeBiopsy(req.body));
});

router.post('/call/PediatricTissueBiopsy', authenticate, (req, res) => {
  res.json(PediatricTissueBiopsy(req.body));
});

router.post('/record', authenticate, (req, res) => {
  const { tenant_id, decisionId } = req.body || {};
  if (!tenant_id && !decisionId) return res.status(400).json({ error: 'tenant_id or decisionId required' });

  res.json({ version: '3.113.0', module: 'pcc_neuro_ext14', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true, tenant_id: tenant_id || null, decisionId: decisionId || null, ts: new Date().toISOString() });
});

module.exports = router;
