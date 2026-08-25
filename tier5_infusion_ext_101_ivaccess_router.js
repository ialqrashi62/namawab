// filepath: tier5_infusion_ext_101_ivaccess_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_101_ivaccess_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/picc', asyncH(async (req, res) => res.json(engine.funcs().picc(req.body))));
router.post('/mid', asyncH(async (req, res) => res.json(engine.funcs().midline(req.body))));
router.post('/cent', asyncH(async (req, res) => res.json(engine.funcs().central(req.body))));
router.post('/port', asyncH(async (req, res) => res.json(engine.funcs().port(req.body))));
router.post('/compl', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/maintain', asyncH(async (req, res) => res.json(engine.funcs().maintenance(req.body))));
module.exports = router;
