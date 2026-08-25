'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_106_stroke_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/nihss', asyncH((req, res) => res.json(engine.nihssScore(req.body))));
router.post('/imaging', asyncH((req, res) => res.json(engine.strokeImagingStrategy(req.body))));
module.exports = router;