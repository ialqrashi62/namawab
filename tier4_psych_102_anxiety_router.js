'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_102_anxiety_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/gad', asyncH((req, res) => res.json(engine.gad(req.body))));
router.post('/panic', asyncH((req, res) => res.json(engine.panic(req.body))));
module.exports = router;