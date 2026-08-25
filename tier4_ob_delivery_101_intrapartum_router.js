'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ob_delivery_101_intrapartum_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/partogram', asyncH((req, res) => res.json(engine.partogramCheck(req.body))));
router.post('/stage', asyncH((req, res) => res.json(engine.stageOfLabor(req.body))));
module.exports = router;