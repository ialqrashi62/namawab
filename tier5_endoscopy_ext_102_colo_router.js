// filepath: tier5_endoscopy_ext_102_colo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_102_colo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/prep', asyncH(async (req, res) => res.json(engine.funcs().prep(req.body))));
router.post('/poly', asyncH(async (req, res) => res.json(engine.funcs().polyp(req.body))));
router.post('/ins', asyncH(async (req, res) => res.json(engine.funcs().insertion(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/fup', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;