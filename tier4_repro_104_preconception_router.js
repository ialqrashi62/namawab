'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_repro_104_preconception_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/screen', asyncH((req, res) => res.json(engine.preconceptionScreen(req.body))));
router.post('/counsel', asyncH((req, res) => res.json(engine.preconceptionCounsel(req.body))));
module.exports = router;