'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_101_general_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/gerd', asyncH((req, res) => res.json(engine.gerdManagement(req.body))));
router.post('/ibs', asyncH((req, res) => res.json(engine.ibsClassification(req.body))));
router.post('/dyspepsia', asyncH((req, res) => res.json(engine.dyspepsiaTriage(req.body))));
module.exports = router;