'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_104_menopause_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stage', asyncH((req, res) => res.json(engine.menopauseStage(req.body))));
router.post('/ht', asyncH((req, res) => res.json(engine.hormoneTherapySafety(req.body))));
module.exports = router;