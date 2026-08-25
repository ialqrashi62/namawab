'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_105_voice_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dysphonia', asyncH((req, res) => res.json(engine.dysphoniaWorkup(req.body))));
router.post('/vocal', asyncH((req, res) => res.json(engine.vocalCordParalysisManagement(req.body))));
module.exports = router;