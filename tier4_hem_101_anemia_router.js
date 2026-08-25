'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_101_anemia_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/workup', asyncH((req, res) => res.json(engine.anemiaWorkup(req.body))));
module.exports = router;