'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_103_lipid_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/risk', asyncH((req, res) => res.json(engine.ascvdRisk(req.body))));
router.post('/statin', asyncH((req, res) => res.json(engine.statinTherapy(req.body))));
module.exports = router;