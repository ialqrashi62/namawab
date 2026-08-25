'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_paediatric_104_devdev_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dev', asyncH((req, res) => res.json(engine.developmentalMilestonesCheck(req.body))));
router.post('/mchat', asyncH((req, res) => res.json(engine.autismScreeningMchat(req.body))));
module.exports = router;