'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_102_hemmalig_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/lymphoma', asyncH((req, res) => res.json(engine.lymphomaStaging(req.body))));
router.post('/mm', asyncH((req, res) => res.json(engine.myelomaStaging(req.body))));
module.exports = router;