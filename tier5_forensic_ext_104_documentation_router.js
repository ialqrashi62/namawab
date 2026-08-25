// filepath: tier5_forensic_ext_104_documentation_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_104_documentation_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/note', asyncH(async (req, res) => res.json(engine.funcs().note_quality(req.body))));
router.post('/evidence', asyncH(async (req, res) => res.json(engine.funcs().evidence_log(req.body))));
router.post('/intake', asyncH(async (req, res) => res.json(engine.funcs().intake(req.body))));
router.post('/custody', asyncH(async (req, res) => res.json(engine.funcs().chain(req.body))));
router.post('/release', asyncH(async (req, res) => res.json(engine.funcs().release(req.body))));

module.exports = router;
