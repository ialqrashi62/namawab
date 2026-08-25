'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_106_bone_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/osteoporosis', asyncH((req, res) => res.json(engine.osteoporosisScreen(req.body))));
router.post('/calcium', asyncH((req, res) => res.json(engine.hypercalcemiaWorkup(req.body))));
module.exports = router;