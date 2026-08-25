'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_103_pd_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/adequacy', asyncH((req, res) => res.json(engine.pdAdequacy(req.body))));
router.post('/peritonitis', asyncH((req, res) => res.json(engine.peritonitisManagement(req.body))));
module.exports = router;