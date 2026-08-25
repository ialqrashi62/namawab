'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_104_appropriate_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/headache', asyncH((req, res) => res.json(engine.imagingForHeadache(req.body))));
router.post('/lowback', asyncH((req, res) => res.json(engine.imagingForLowBackPain(req.body))));
module.exports = router;