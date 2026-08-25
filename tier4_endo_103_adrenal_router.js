'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_103_adrenal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/insufficiency', asyncH((req, res) => res.json(engine.adrenalInsufficiency(req.body))));
router.post('/cushing', asyncH((req, res) => res.json(engine.cushingsEval(req.body))));
router.post('/pheo', asyncH((req, res) => res.json(engine.pheochromocytoma(req.body))));
module.exports = router;