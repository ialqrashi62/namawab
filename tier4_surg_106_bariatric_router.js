'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_106_bariatric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/eligible', asyncH((req, res) => res.json(engine.bariatricEligibility(req.body))));
router.post('/procedure', asyncH((req, res) => res.json(engine.bariatricProcedureChoice(req.body))));
module.exports = router;