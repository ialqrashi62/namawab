'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_104_infection_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/sepsis', asyncH((req, res) => res.json(engine.sepsisScreen(req.body))));
router.post('/cellulitis', asyncH((req, res) => res.json(engine.cellulitis(req.body))));
module.exports = router;