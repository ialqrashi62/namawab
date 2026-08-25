'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_105_myositis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/iim', asyncH((req, res) => res.json(engine.idiopathicInflammatoryMyopathy(req.body))));
router.post('/ass', asyncH((req, res) => res.json(engine.antisynthetaseSyndrome(req.body))));
module.exports = router;