'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_102_pediatric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/gmfcs', asyncH((req, res) => res.json(engine.gmfcLevels(req.body))));
router.post('/cp', asyncH((req, res) => res.json(engine.cpGmfcs(req.body))));
module.exports = router;