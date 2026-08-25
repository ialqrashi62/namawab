'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_path_105_immuno_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/her2', asyncH((req, res) => res.json(engine.her2Score(req.body))));
router.post('/pdl1', asyncH((req, res) => res.json(engine.pdl1Tps(req.body))));
module.exports = router;