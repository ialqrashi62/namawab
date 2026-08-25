'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_103_thrombosis_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dvt', asyncH((req, res) => res.json(engine.dvt(req.body))));
router.post('/aps', asyncH((req, res) => res.json(engine.aps(req.body))));
module.exports = router;