'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_103_sinusitis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/acute', asyncH((req, res) => res.json(engine.sinusitisAcute(req.body))));
router.post('/chronic', asyncH((req, res) => res.json(engine.sinusitisChronic(req.body))));
module.exports = router;