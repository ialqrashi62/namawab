'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_108_peds_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/uti', asyncH((req, res) => res.json(engine.pediatricUTI(req.body))));
router.post('/nephrotic', asyncH((req, res) => res.json(engine.nephroticSyndromePeds(req.body))));
module.exports = router;