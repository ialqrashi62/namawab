'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_107_skin_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cellulitis', asyncH((req, res) => res.json(engine.cellulitis(req.body))));
router.post('/necrotizing', asyncH((req, res) => res.json(engine.necrotizing(req.body))));
module.exports = router;