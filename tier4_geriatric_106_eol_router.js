'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_106_eol_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/goals', asyncH((req, res) => res.json(engine.goalsOfCareDiscussion(req.body))));
router.post('/hospice', asyncH((req, res) => res.json(engine.hospiceEligibility(req.body))));
module.exports = router;