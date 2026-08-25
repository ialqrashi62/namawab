'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_107_gionc_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/crc-staging', asyncH((req, res) => res.json(engine.crcStaging(req.body))));
router.post('/gastric', asyncH((req, res) => res.json(engine.gastricCancer(req.body))));
router.post('/hcc', asyncH((req, res) => res.json(engine.hccSurveillance(req.body))));
module.exports = router;