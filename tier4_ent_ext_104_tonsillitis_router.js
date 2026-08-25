'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_104_tonsillitis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/score', asyncH((req, res) => res.json(engine.centorScore(req.body))));
router.post('/abscess', asyncH((req, res) => res.json(engine.peritonsillarAbscess(req.body))));
module.exports = router;