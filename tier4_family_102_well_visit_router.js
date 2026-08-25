'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_family_102_well_visit_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/adult', asyncH((req, res) => res.json(engine.wellVisitAdult(req.body))));
router.post('/dev', asyncH((req, res) => res.json(engine.developmentalMilestones(req.body))));
module.exports = router;