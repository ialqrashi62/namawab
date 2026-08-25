'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_101_ckd_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stage', asyncH((req, res) => res.json(engine.ckdStaging(req.body))));
router.post('/progression', asyncH((req, res) => res.json(engine.ackdProgression(req.body))));
module.exports = router;