'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_107_mpn_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stratify', asyncH((req, res) => res.json(engine.mpnStratify(req.body))));
module.exports = router;