'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_106_stones_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/colic', asyncH((req, res) => res.json(engine.renalColic(req.body))));
router.post('/composition', asyncH((req, res) => res.json(engine.stoneComposition(req.body))));
module.exports = router;