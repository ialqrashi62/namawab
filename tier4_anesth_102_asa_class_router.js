'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_102_asa_class_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/class', asyncH((req, res) => res.json(engine.asaClass(req.body))));
router.post('/preop', asyncH((req, res) => res.json(engine.preoperativeOptimization(req.body))));
module.exports = router;