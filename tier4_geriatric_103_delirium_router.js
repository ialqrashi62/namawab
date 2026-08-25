'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_103_delirium_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cam', asyncH((req, res) => res.json(engine.camAssessment(req.body))));
router.post('/prevent', asyncH((req, res) => res.json(engine.deliriumPrevention(req.body))));
module.exports = router;