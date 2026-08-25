'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ophth_103_cornea_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ulcer', asyncH((req, res) => res.json(engine.cornealUlcer(req.body))));
router.post('/dryeye', asyncH((req, res) => res.json(engine.dryEye(req.body))));
module.exports = router;