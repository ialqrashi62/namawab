'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_ext_105_pe_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/score', asyncH((req, res) => res.json(engine.wellsScorePE(req.body))));
router.post('/imaging', asyncH((req, res) => res.json(engine.peImagingStrategy(req.body))));
module.exports = router;