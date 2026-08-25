'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_107_gout_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/flare', asyncH((req, res) => res.json(engine.goutFlare(req.body))));
router.post('/ult', asyncH((req, res) => res.json(engine.urateLowering(req.body))));
module.exports = router;