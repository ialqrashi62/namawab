'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_102_hd_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/adequacy', asyncH((req, res) => res.json(engine.hdAdequacy(req.body))));
router.post('/access', asyncH((req, res) => res.json(engine.vascularAccess(req.body))));
router.post('/idh', asyncH((req, res) => res.json(engine.intradialyticHypotension(req.body))));
module.exports = router;