// pcc_pediatric_surg_ext28 routes v3.138.0
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const { PediatricBurnSurgeryExt, PediatricScarRevisionExt, PediatricContractureRelease, PediatricSkinGraftExt, PediatricFlapSurgeryExt, PediatricTissueExpansionExt, PediatricVACTherapyExt, PediatricWoundDebridementExt, PediatricDermalMatrixExt, PediatricCulturedEpidermis } = require('./pcc_pediatric_surg_ext28_engine');

router.get('/list', authenticate, (req, res) => {
  res.json({ version: '3.138.0', module: 'pcc_pediatric_surg_ext28', label: 'PCC Pediatric Surg Ext28', functions: ['PediatricBurnSurgeryExt', 'PediatricScarRevisionExt', 'PediatricContractureRelease', 'PediatricSkinGraftExt', 'PediatricFlapSurgeryExt', 'PediatricTissueExpansionExt', 'PediatricVACTherapyExt', 'PediatricWoundDebridementExt', 'PediatricDermalMatrixExt', 'PediatricCulturedEpidermis'] });
});
router.post('/call/PediatricBurnSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricBurnSurgeryExt(req.body));
});

router.post('/call/PediatricScarRevisionExt', authenticate, (req, res) => {
  res.json(PediatricScarRevisionExt(req.body));
});

router.post('/call/PediatricContractureRelease', authenticate, (req, res) => {
  res.json(PediatricContractureRelease(req.body));
});

router.post('/call/PediatricSkinGraftExt', authenticate, (req, res) => {
  res.json(PediatricSkinGraftExt(req.body));
});

router.post('/call/PediatricFlapSurgeryExt', authenticate, (req, res) => {
  res.json(PediatricFlapSurgeryExt(req.body));
});

router.post('/call/PediatricTissueExpansionExt', authenticate, (req, res) => {
  res.json(PediatricTissueExpansionExt(req.body));
});

router.post('/call/PediatricVACTherapyExt', authenticate, (req, res) => {
  res.json(PediatricVACTherapyExt(req.body));
});

router.post('/call/PediatricWoundDebridementExt', authenticate, (req, res) => {
  res.json(PediatricWoundDebridementExt(req.body));
});

router.post('/call/PediatricDermalMatrixExt', authenticate, (req, res) => {
  res.json(PediatricDermalMatrixExt(req.body));
});

router.post('/call/PediatricCulturedEpidermis', authenticate, (req, res) => {
  res.json(PediatricCulturedEpidermis(req.body));
});

router.post('/record', authenticate, (req, res) => {
  res.json({ version: '3.138.0', module: 'pcc_pediatric_surg_ext28', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true });
});

module.exports = router;
