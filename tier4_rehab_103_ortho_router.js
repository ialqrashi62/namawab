'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_103_ortho_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/tkr', asyncH((req, res) => res.json(engine.tkrProtocol(req.body))));
router.post('/shoulder', asyncH((req, res) => res.json(engine.shoulderRc(req.body))));
module.exports = router;