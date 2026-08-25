'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_101_stones_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/size', asyncH((req, res) => res.json(engine.kidneyStoneSize(req.body))));
router.post('/uti', asyncH((req, res) => res.json(engine.uti(req.body))));
module.exports = router;