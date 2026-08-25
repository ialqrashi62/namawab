'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_105_contrast_safety_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/renal', asyncH((req, res) => res.json(engine.contrastRenal(req.body))));
router.post('/gfr', asyncH((req, res) => res.json(engine.gfr(req.body))));
module.exports = router;