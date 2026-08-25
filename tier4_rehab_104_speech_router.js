'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_104_speech_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dysphagia', asyncH((req, res) => res.json(engine.dysphagia(req.body))));
router.post('/aphasia', asyncH((req, res) => res.json(engine.aphasiaType(req.body))));
module.exports = router;