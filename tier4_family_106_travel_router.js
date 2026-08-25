'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_family_106_travel_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/consult', asyncH((req, res) => res.json(engine.travelConsult(req.body))));
router.post('/vaccines', asyncH((req, res) => res.json(engine.travelVaccines(req.body))));
module.exports = router;