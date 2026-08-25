'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_108_pleural_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/effusion', asyncH((req, res) => res.json(engine.pleuralEffusion(req.body))));
router.post('/pneumothorax', asyncH((req, res) => res.json(engine.pneumothorax(req.body))));
module.exports = router;