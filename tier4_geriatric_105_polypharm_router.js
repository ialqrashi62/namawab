'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_105_polypharm_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/beers', asyncH((req, res) => res.json(engine.beersCriteriaCheck(req.body))));
router.post('/deprescribe', asyncH((req, res) => res.json(engine.deprescribingPlan(req.body))));
module.exports = router;