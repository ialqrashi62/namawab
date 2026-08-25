'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_105_scleroderma_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/scleroderma', asyncH((req, res) => res.json(engine.limitedVsDiffuseScleroderma(req.body))));
router.post('/raynaud', asyncH((req, res) => res.json(engine.raynaudsManagement(req.body))));
module.exports = router;