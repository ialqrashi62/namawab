'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_106_peds_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/peds', asyncH((req, res) => res.json(engine.pediatricPalliative(req.body))));
module.exports = router;