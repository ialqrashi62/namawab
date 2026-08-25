'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_104_frailty_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/fried', asyncH((req, res) => res.json(engine.frailtyPhenotype(req.body))));
router.post('/cfs', asyncH((req, res) => res.json(engine.clinicalFrailtyScale(req.body))));
module.exports = router;