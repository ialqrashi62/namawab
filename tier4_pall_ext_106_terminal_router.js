'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_106_terminal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/imminent', asyncH((req, res) => res.json(engine.imminentDeathSigns(req.body))));
router.post('/terminal', asyncH((req, res) => res.json(engine.terminalSedation(req.body))));
module.exports = router;