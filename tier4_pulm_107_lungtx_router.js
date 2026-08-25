'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_107_lungtx_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/candidate', asyncH((req, res) => res.json(engine.lungTxCandidate(req.body))));
router.post('/clad', asyncH((req, res) => res.json(engine.chronicLungAllograftDysfunction(req.body))));
module.exports = router;