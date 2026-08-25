'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_101_general_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/sepsis', asyncH((req, res) => res.json(engine.sepsisBundle(req.body))));
router.post('/fuo', asyncH((req, res) => res.json(engine.fuo(req.body))));
module.exports = router;