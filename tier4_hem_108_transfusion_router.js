'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_108_transfusion_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/prbc', asyncH((req, res) => res.json(engine.prbcTransfusion(req.body))));
router.post('/plt', asyncH((req, res) => res.json(engine.pltTransfusion(req.body))));
module.exports = router;