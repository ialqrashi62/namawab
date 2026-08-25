'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_104_pituitary_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/prolactinoma', asyncH((req, res) => res.json(engine.prolactinoma(req.body))));
router.post('/acromegaly', asyncH((req, res) => res.json(engine.acromegaly(req.body))));
router.post('/hypopit', asyncH((req, res) => res.json(engine.hypopituitarism(req.body))));
module.exports = router;