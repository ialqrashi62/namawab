'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_103_vasculitis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/anca', asyncH((req, res) => res.json(engine.ancaScreening(req.body))));
router.post('/gca', asyncH((req, res) => res.json(engine.giantCellArteritis(req.body))));
module.exports = router;