'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_103_neuro_imaging_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stroke', asyncH((req, res) => res.json(engine.strokeImaging(req.body))));
router.post('/headtrauma', asyncH((req, res) => res.json(engine.headTrauma(req.body))));
module.exports = router;