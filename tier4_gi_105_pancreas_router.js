'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_105_pancreas_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/acute', asyncH((req, res) => res.json(engine.acutePancreatitis(req.body))));
router.post('/chronic', asyncH((req, res) => res.json(engine.chronicPancreatitis(req.body))));
router.post('/cyst', asyncH((req, res) => res.json(engine.pancreaticCystMngmnt(req.body))));
module.exports = router;