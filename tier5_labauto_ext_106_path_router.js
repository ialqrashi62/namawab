// filepath: tier5_labauto_ext_106_path_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_106_path_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/gross', asyncH(async (req, res) => res.json(engine.funcs().gross(req.body))));
router.post('/proc', asyncH(async (req, res) => res.json(engine.funcs().processing(req.body))));
router.post('/dx', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/froz', asyncH(async (req, res) => res.json(engine.funcs().frozen(req.body))));
router.post('/ihc', asyncH(async (req, res) => res.json(engine.funcs().ihc(req.body))));
router.post('/q', asyncH(async (req, res) => res.json(engine.funcs().quality(req.body))));
module.exports = router;