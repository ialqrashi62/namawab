'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_105_pelv_pain_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/endomet', asyncH((req, res) => res.json(engine.endometriosisScreen(req.body))));
router.post('/pcos', asyncH((req, res) => res.json(engine.pcosDiagnosis(req.body))));
module.exports = router;