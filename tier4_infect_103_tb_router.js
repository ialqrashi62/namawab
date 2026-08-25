'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_103_tb_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/active', asyncH((req, res) => res.json(engine.activeTb(req.body))));
router.post('/ltbi', asyncH((req, res) => res.json(engine.ltbi(req.body))));
module.exports = router;