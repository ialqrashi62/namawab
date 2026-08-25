'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_106_oral_surgery_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/thirdmolar', asyncH((req, res) => res.json(engine.thirdMolar(req.body))));
router.post('/fracture', asyncH((req, res) => res.json(engine.facialFracture(req.body))));
module.exports = router;