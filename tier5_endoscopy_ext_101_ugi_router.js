// filepath: tier5_endoscopy_ext_101_ugi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_101_ugi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/find', asyncH(async (req, res) => res.json(engine.funcs().findings(req.body))));
router.post('/sed', asyncH(async (req, res) => res.json(engine.funcs().sedation(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post(req.body))));
router.post('/path', asyncH(async (req, res) => res.json(engine.funcs().pathology(req.body))));
module.exports = router;