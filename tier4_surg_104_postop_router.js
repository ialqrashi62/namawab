'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_104_postop_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/complication', asyncH((req, res) => res.json(engine.postopComplication(req.body))));
router.post('/ileus', asyncH((req, res) => res.json(engine.postopIleus(req.body))));
module.exports = router;