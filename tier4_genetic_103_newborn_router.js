'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_103_newborn_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/result', asyncH((req, res) => res.json(engine.newbornScreenResult(req.body))));
router.post('/follow', asyncH((req, res) => res.json(engine.newbornFollowUpPlan(req.body))));
module.exports = router;