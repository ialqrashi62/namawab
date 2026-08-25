'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_102_contrast_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/gfr', asyncH((req, res) => res.json(engine.contrastNephropathyRisk(req.body))));
router.post('/reaction', asyncH((req, res) => res.json(engine.contrastReactionManagement(req.body))));
module.exports = router;