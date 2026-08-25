'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_repro_105_ovary_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/reserve', asyncH((req, res) => res.json(engine.ovarianReserve(req.body))));
router.post('/ivf', asyncH((req, res) => res.json(engine.ivfStimulationProtocol(req.body))));
module.exports = router;