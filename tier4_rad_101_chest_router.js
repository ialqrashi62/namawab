'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_101_chest_imaging_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/nodule', asyncH((req, res) => res.json(engine.pulmonaryNodule(req.body))));
router.post('/pe', asyncH((req, res) => res.json(engine.pecRule(req.body))));
module.exports = router;