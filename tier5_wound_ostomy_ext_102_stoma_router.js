// filepath: tier5_wound_ostomy_ext_102_stoma_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_102_stoma_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/mark', asyncH(async (req, res) => res.json(engine.funcs().marking(req.body))));
router.post('/appl', asyncH(async (req, res) => res.json(engine.funcs().appliance(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/rev', asyncH(async (req, res) => res.json(engine.funcs().reversal(req.body))));
router.post('/irrig', asyncH(async (req, res) => res.json(engine.funcs().irrigation(req.body))));
module.exports = router;
