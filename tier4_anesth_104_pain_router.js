'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_104_pain_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/postop', asyncH((req, res) => res.json(engine.postopPain(req.body))));
router.post('/chronic', asyncH((req, res) => res.json(engine.chronicOpioid(req.body))));
module.exports = router;