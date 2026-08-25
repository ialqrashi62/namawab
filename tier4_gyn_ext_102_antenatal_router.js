'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_102_antenatal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/trim', asyncH((req, res) => res.json(engine.trimesterCare(req.body))));
router.post('/pec', asyncH((req, res) => res.json(engine.preeclampsiaScreen(req.body))));
module.exports = router;