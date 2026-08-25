'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_106_gout_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/acute', asyncH((req, res) => res.json(engine.acuteGoutTreatment(req.body))));
router.post('/chronic', asyncH((req, res) => res.json(engine.chronicUrateLoweringTherapy(req.body))));
module.exports = router;