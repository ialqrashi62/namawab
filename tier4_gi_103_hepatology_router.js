'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_103_hepatology_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/cirrhosis', asyncH((req, res) => res.json(engine.cirrhosisAssessment(req.body))));
router.post('/hepatitis', asyncH((req, res) => res.json(engine.hepatitisCare(req.body))));
router.post('/ascites', asyncH((req, res) => res.json(engine.ascitesManagement(req.body))));
router.post('/he', asyncH((req, res) => res.json(engine.hepaticEncephalopathy(req.body))));
module.exports = router;