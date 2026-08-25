'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_chronic_102_selfcare_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/sms', asyncH((req, res) => res.json(engine.selfManagementSupport(req.body))));
router.post('/adherence', asyncH((req, res) => res.json(engine.adherence(req.body))));
module.exports = router;