'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_105_obstetric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/labor', asyncH((req, res) => res.json(engine.laborAnalgesia(req.body))));
router.post('/csection', asyncH((req, res) => res.json(engine.cesareanAnesthesia(req.body))));
module.exports = router;