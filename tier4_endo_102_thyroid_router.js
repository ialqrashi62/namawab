'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_102_thyroid_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/hypothyroid', asyncH((req, res) => res.json(engine.hypothyroidism(req.body))));
router.post('/hyperthyroid', asyncH((req, res) => res.json(engine.hyperthyroidism(req.body))));
router.post('/nodule', asyncH((req, res) => res.json(engine.thyroidNodule(req.body))));
module.exports = router;