'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_102_hiv_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/art', asyncH((req, res) => res.json(engine.artInitiation(req.body))));
router.post('/opportunistic', asyncH((req, res) => res.json(engine.opportunisticProphylaxis(req.body))));
module.exports = router;