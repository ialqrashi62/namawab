'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_102_ibd_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/diagnosis', asyncH((req, res) => res.json(engine.ibdDiagnosis(req.body))));
router.post('/uc-severity', asyncH((req, res) => res.json(engine.ucSeverity(req.body))));
router.post('/therapy', asyncH((req, res) => res.json(engine.ibdTherapy(req.body))));
module.exports = router;