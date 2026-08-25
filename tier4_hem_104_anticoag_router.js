'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_104_anticoag_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/doac', asyncH((req, res) => res.json(engine.doacChoice(req.body))));
router.post('/reversal', asyncH((req, res) => res.json(engine.reversal(req.body))));
module.exports = router;