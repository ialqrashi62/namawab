'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_105_enteral_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/route', asyncH((req, res) => res.json(engine.enteralRoute(req.body))));
router.post('/tolerance', asyncH((req, res) => res.json(engine.feedingTolerance(req.body))));
module.exports = router;