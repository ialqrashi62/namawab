'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_chronic_105_comorbidity_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cci', asyncH((req, res) => res.json(engine.charlson(req.body))));
router.post('/polypharm', asyncH((req, res) => res.json(engine.polypharmacy(req.body))));
module.exports = router;