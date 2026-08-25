'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_103_spiritual_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/distress', asyncH((req, res) => res.json(engine.spiritualDistress(req.body))));
module.exports = router;