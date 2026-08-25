'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_104_pulmhtn_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/risk', asyncH((req, res) => res.json(engine.pahRiskStrat(req.body))));
router.post('/cteph', asyncH((req, res) => res.json(engine.chronicThromboEmbolic(req.body))));
module.exports = router;