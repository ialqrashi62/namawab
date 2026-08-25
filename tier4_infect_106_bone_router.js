'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_106_bone_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/osteomyelitis', asyncH((req, res) => res.json(engine.osteomyelitis(req.body))));
router.post('/septic-arthritis', asyncH((req, res) => res.json(engine.septicArthritis(req.body))));
module.exports = router;