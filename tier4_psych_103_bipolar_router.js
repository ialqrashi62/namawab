'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_103_bipolar_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/mania', asyncH((req, res) => res.json(engine.maniaAcute(req.body))));
router.post('/maintenance', asyncH((req, res) => res.json(engine.bipolarMaintenance(req.body))));
module.exports = router;