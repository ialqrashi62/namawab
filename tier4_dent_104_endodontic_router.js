'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_104_endodontic_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/complexity', asyncH((req, res) => res.json(engine.rootCanalComplexity(req.body))));
router.post('/periapical', asyncH((req, res) => res.json(engine.periapicalDiagnosis(req.body))));
module.exports = router;