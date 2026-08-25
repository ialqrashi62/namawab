'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_103_sct_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/type', asyncH((req, res) => res.json(engine.transplantType(req.body))));
router.post('/gvhd', asyncH((req, res) => res.json(engine.gvhdManagement(req.body))));
module.exports = router;