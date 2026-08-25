'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ob_delivery_102_fetal_monitor_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/category', asyncH((req, res) => res.json(engine.fetalHeartRateCategory(req.body))));
router.post('/decel', asyncH((req, res) => res.json(engine.variableVsLateDeceleration(req.body))));
module.exports = router;