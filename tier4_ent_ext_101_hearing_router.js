'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_101_hearing_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/screen', asyncH((req, res) => res.json(engine.hearingScreening(req.body))));
router.post('/sshl', asyncH((req, res) => res.json(engine.suddenSensorineuralHearingLoss(req.body))));
module.exports = router;