'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gi_106_colorectal_engine');
function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
router.post('/hemorrhoids', asyncH((req, res) => res.json(engine.hemorrhoids(req.body))));
router.post('/screening', asyncH((req, res) => res.json(engine.colorectalCancerScreening(req.body))));
router.post('/diverticulitis', asyncH((req, res) => res.json(engine.diverticulitis(req.body))));
module.exports = router;