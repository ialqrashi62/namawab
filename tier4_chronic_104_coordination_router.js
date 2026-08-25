'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_chronic_104_coordination_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/team', asyncH((req, res) => res.json(engine.careTeam(req.body))));
router.post('/visit', asyncH((req, res) => res.json(engine.visitPlanning(req.body))));
module.exports = router;