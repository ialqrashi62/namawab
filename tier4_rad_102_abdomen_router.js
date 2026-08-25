'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rad_102_abdomen_imaging_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/liver', asyncH((req, res) => res.json(engine.liverLesion(req.body))));
router.post('/pancyst', asyncH((req, res) => res.json(engine.pancreaticCyst(req.body))));
module.exports = router;