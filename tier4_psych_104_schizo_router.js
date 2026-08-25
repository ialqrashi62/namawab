'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_104_schizo_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/fep', asyncH((req, res) => res.json(engine.firstEpisodePsychosis(req.body))));
router.post('/trs', asyncH((req, res) => res.json(engine.treatmentResistant(req.body))));
module.exports = router;