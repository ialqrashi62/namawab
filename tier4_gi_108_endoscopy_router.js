'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_108_endoscopy_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/polyp-risk', asyncH((req, res) => res.json(engine.polypRisk(req.body))));
router.post('/bleeding-triage', asyncH((req, res) => res.json(engine.giBleedingTriage(req.body))));
router.post('/eus', asyncH((req, res) => res.json(engine.eusFn(req.body))));
module.exports = router;