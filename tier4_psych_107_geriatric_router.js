'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_107_geriatric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/delirium', asyncH((req, res) => res.json(engine.delirium(req.body))));
router.post('/bpsd', asyncH((req, res) => res.json(engine.dementiaBehavioral(req.body))));
module.exports = router;