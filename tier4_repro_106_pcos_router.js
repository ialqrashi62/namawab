'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_repro_106_pcos_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/rotterdam', asyncH((req, res) => res.json(engine.rotterdamCriteria(req.body))));
router.post('/manage', asyncH((req, res) => res.json(engine.pcosManagement(req.body))));
module.exports = router;