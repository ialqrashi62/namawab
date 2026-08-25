'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_paediatric_106_adolescent_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/heeaddsss', asyncH((req, res) => res.json(engine.heeadsssScreening(req.body))));
router.post('/immz', asyncH((req, res) => res.json(engine.adolescentImmunization(req.body))));
module.exports = router;