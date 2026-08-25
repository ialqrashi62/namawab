'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_repro_101_ivf_workup_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/initial', asyncH((req, res) => res.json(engine.ivfInitialWorkup(req.body))));
router.post('/indications', asyncH((req, res) => res.json(engine.ivfIndications(req.body))));
module.exports = router;