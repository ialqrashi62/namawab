'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_103_periop_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/vte', asyncH((req, res) => res.json(engine.vteProphylaxis(req.body))));
router.post('/cardiac', asyncH((req, res) => res.json(engine.perioperativeCardiacRisk(req.body))));
module.exports = router;