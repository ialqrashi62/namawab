'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_105_immuno_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/irae', asyncH((req, res) => res.json(engine.iraeManagement(req.body))));
router.post('/selection', asyncH((req, res) => res.json(engine.iciSelection(req.body))));
module.exports = router;