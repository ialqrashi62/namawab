'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ophth_104_pediatrics_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/amblyopia', asyncH((req, res) => res.json(engine.amblyopia(req.body))));
router.post('/redreflex', asyncH((req, res) => res.json(engine.redReflex(req.body))));
module.exports = router;