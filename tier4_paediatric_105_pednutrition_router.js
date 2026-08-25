'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_paediatric_105_pednutrition_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/infant', asyncH((req, res) => res.json(engine.infantFeeding(req.body))));
router.post('/picky', asyncH((req, res) => res.json(engine.pickyEaterScreen(req.body))));
module.exports = router;