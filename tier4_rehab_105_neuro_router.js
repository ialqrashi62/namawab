'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_105_neuro_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/rancho', asyncH((req, res) => res.json(engine.ranchoLosAmigos(req.body))));
router.post('/mobility', asyncH((req, res) => res.json(engine.functionalMobility(req.body))));
module.exports = router;