'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_path_103_gi_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dysplasia', asyncH((req, res) => res.json(engine.dysplasiaGrade(req.body))));
router.post('/hpylori', asyncH((req, res) => res.json(engine.helicobacterBiopsy(req.body))));
module.exports = router;