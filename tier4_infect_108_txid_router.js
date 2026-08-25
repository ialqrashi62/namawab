'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_108_txid_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/prophylaxis', asyncH((req, res) => res.json(engine.prophylaxis(req.body))));
router.post('/oi', asyncH((req, res) => res.json(engine.opportunisticInfection(req.body))));
module.exports = router;