'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_105_platelet_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/thrombo', asyncH((req, res) => res.json(engine.thrombocytopenia(req.body))));
router.post('/itp', asyncH((req, res) => res.json(engine.itp(req.body))));
module.exports = router;