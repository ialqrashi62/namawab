'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_path_104_cyto_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/thyroid', asyncH((req, res) => res.json(engine.thyroidBethesda(req.body))));
router.post('/breast', asyncH((req, res) => res.json(engine.breastYokohama(req.body))));
module.exports = router;