'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_108_peds_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/kd', asyncH((req, res) => res.json(engine.kawasakiDisease(req.body))));
router.post('/jia', asyncH((req, res) => res.json(engine.jia(req.body))));
module.exports = router;