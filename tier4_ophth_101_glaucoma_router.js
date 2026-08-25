'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ophth_101_glaucoma_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/risk', asyncH((req, res) => res.json(engine.glaucomaRisk(req.body))));
router.post('/angleclosure', asyncH((req, res) => res.json(engine.angleClosure(req.body))));
module.exports = router;