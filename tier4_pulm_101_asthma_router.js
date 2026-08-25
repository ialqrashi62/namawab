'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_101_asthma_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/control', asyncH((req, res) => res.json(engine.asthmaControl(req.body))));
router.post('/biologic', asyncH((req, res) => res.json(engine.severeAsthmaBiologic(req.body))));
module.exports = router;