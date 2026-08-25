'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_104_urooncology_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/prostate', asyncH((req, res) => res.json(engine.prostateCancerRisk(req.body))));
router.post('/bladder', asyncH((req, res) => res.json(engine.bladderCancer(req.body))));
module.exports = router;