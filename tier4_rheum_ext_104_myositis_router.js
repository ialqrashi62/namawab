'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_104_myositis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/inflammatory', asyncH((req, res) => res.json(engine.inflammatoryMyopathyScreen(req.body))));
router.post('/statin', asyncH((req, res) => res.json(engine.statinMyopathyVsInflammatory(req.body))));
module.exports = router;