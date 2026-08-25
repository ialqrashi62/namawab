'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_104_glomerular_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/nephrotic', asyncH((req, res) => res.json(engine.nephroticSyndrome(req.body))));
router.post('/rpgn', asyncH((req, res) => res.json(engine.rapidProgressiveGn(req.body))));
module.exports = router;