'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_103_spondylo_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/axial', asyncH((req, res) => res.json(engine.axialSpa(req.body))));
router.post('/peripheral', asyncH((req, res) => res.json(engine.peripheralSpa(req.body))));
module.exports = router;