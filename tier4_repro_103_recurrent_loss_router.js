'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_repro_103_recurrent_loss_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/workup', asyncH((req, res) => res.json(engine.recurrentLossWorkup(req.body))));
router.post('/aps', asyncH((req, res) => res.json(engine.antiphospholipidSyndromeCriteria(req.body))));
module.exports = router;