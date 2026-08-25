'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_107_obesity_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/classify', asyncH((req, res) => res.json(engine.obesityClassTherapy(req.body))));
router.post('/bariatric', asyncH((req, res) => res.json(engine.bariatricEval(req.body))));
module.exports = router;