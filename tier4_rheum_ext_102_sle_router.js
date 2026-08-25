'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_102_sle_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/criteria', asyncH((req, res) => res.json(engine.slaccEularCriteria(req.body))));
router.post('/sledai', asyncH((req, res) => res.json(engine.sledaiScore(req.body))));
module.exports = router;