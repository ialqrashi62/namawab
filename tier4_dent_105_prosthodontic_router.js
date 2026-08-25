'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_105_prosthodontic_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/crown', asyncH((req, res) => res.json(engine.crown(req.body))));
router.post('/edentulous', asyncH((req, res) => res.json(engine.edentulousSpace(req.body))));
module.exports = router;