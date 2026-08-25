'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_104_carrier_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/screen', asyncH((req, res) => res.json(engine.expandedCarrierScreen(req.body))));
router.post('/risk', asyncH((req, res) => res.json(engine.carrierRiskCounseling(req.body))));
module.exports = router;