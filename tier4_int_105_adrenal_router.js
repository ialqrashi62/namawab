'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_105_adrenal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cushing', asyncH((req, res) => res.json(engine.cushingScreening(req.body))));
router.post('/adrenal', asyncH((req, res) => res.json(engine.adrenalInsufficiency(req.body))));
module.exports = router;