'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_108_repro_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/pcos', asyncH((req, res) => res.json(engine.pcos(req.body))));
router.post('/hypogonadism', asyncH((req, res) => res.json(engine.hypogonadism(req.body))));
module.exports = router;