'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_108_cap_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/adhd', asyncH((req, res) => res.json(engine.adhd(req.body))));
router.post('/asd', asyncH((req, res) => res.json(engine.autism(req.body))));
module.exports = router;