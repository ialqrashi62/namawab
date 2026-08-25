'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_101_mri_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/safety', asyncH((req, res) => res.json(engine.mriSafetyScreening(req.body))));
router.post('/pacemaker', asyncH((req, res) => res.json(engine.mriPacemakerSafety(req.body))));
module.exports = router;