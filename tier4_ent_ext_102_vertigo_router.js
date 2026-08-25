'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_102_vertigo_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/hints', asyncH((req, res) => res.json(engine.vertigoPeripheralVsCentral(req.body))));
router.post('/bppv', asyncH((req, res) => res.json(engine.bppvRepositioningManeuver(req.body))));
module.exports = router;