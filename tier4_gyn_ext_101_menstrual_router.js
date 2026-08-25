'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_101_menstrual_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/aub', asyncH((req, res) => res.json(engine.aubPalmbCoein(req.body))));
router.post('/pattern', asyncH((req, res) => res.json(engine.menstrual(req.body))));
module.exports = router;