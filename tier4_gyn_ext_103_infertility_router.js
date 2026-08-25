'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_103_infertility_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/workup', asyncH((req, res) => res.json(engine.infertilityWorkup(req.body))));
router.post('/ovulation', asyncH((req, res) => res.json(engine.ovulationCheck(req.body))));
module.exports = router;