'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_103_bph_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ipss', asyncH((req, res) => res.json(engine.ipss(req.body))));
router.post('/psa', asyncH((req, res) => res.json(engine.psa(req.body))));
module.exports = router;