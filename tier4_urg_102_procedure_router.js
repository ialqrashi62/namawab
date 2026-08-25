'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_102_procedure_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/lac', asyncH((req, res) => res.json(engine.laceration(req.body))));
router.post('/abscess', asyncH((req, res) => res.json(engine.abscess(req.body))));
module.exports = router;