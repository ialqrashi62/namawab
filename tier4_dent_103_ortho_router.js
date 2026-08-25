'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_103_ortho_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/malocclusion', asyncH((req, res) => res.json(engine.malocclusion(req.body))));
router.post('/growth', asyncH((req, res) => res.json(engine.growthGuidance(req.body))));
module.exports = router;