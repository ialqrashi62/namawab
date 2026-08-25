'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_102_lupus_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/sledai', asyncH((req, res) => res.json(engine.sledai(req.body))));
router.post('/ln', asyncH((req, res) => res.json(engine.lupusNephritis(req.body))));
module.exports = router;