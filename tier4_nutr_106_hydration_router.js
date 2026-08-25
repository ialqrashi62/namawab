'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_106_hydration_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/hydration', asyncH((req, res) => res.json(engine.hydration(req.body))));
router.post('/electrolyte', asyncH((req, res) => res.json(engine.electrolyteBalance(req.body))));
module.exports = router;