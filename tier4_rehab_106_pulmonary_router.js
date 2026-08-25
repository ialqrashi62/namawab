'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_106_pulmonary_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/6mwt', asyncH((req, res) => res.json(engine.sixMinWalk(req.body))));
router.post('/cpx', asyncH((req, res) => res.json(engine.cardiopulmonaryExercise(req.body))));
module.exports = router;