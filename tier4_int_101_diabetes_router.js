'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_101_diabetes_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/screen', asyncH((req, res) => res.json(engine.diabetesScreening(req.body))));
router.post('/manage', asyncH((req, res) => res.json(engine.diabetesManagement(req.body))));
module.exports = router;