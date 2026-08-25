'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_102_perioperative_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/nsqip', asyncH((req, res) => res.json(engine.nsqipMortalityRisk(req.body))));
router.post('/ssi', asyncH((req, res) => res.json(engine.surgicalSiteInfectionRisk(req.body))));
module.exports = router;