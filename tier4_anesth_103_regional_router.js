'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_103_regional_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/neuraxial', asyncH((req, res) => res.json(engine.neuraxialBlock(req.body))));
router.post('/peripheral', asyncH((req, res) => res.json(engine.peripheralBlock(req.body))));
module.exports = router;