'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_106_scleroderma_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/subset', asyncH((req, res) => res.json(engine.sclerodermaSubset(req.body))));
router.post('/pah', asyncH((req, res) => res.json(engine.pahScreening(req.body))));
module.exports = router;