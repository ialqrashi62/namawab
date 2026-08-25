'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_103_alara_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/alara', asyncH((req, res) => res.json(engine.doseOptimization(req.body))));
router.post('/pediatric', asyncH((req, res) => res.json(engine.pediatricImagingProtocol(req.body))));
module.exports = router;