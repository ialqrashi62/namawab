'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_103_insomnia_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/insomnia', asyncH((req, res) => res.json(engine.insomnia(req.body))));
router.post('/hygiene', asyncH((req, res) => res.json(engine.sleepHygiene(req.body))));
module.exports = router;