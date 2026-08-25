'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_104_msk_imaging_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ottawa', asyncH((req, res) => res.json(engine.ottpawa(req.body))));
router.post('/rotator', asyncH((req, res) => res.json(engine.rotatorCuff(req.body))));
module.exports = router;