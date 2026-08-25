// filepath: tier5_pharm_ext_104_tox_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_104_tox_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/syn', asyncH(async (req, res) => res.json(engine.funcs().toxidrome(req.body))));
router.post('/exp', asyncH(async (req, res) => res.json(engine.funcs().exposure(req.body))));
router.post('/anti', asyncH(async (req, res) => res.json(engine.funcs().antidotes(req.body))));
router.post('/lab', asyncH(async (req, res) => res.json(engine.funcs().labs(req.body))));
router.post('/elim', asyncH(async (req, res) => res.json(engine.funcs().elimination(req.body))));
router.post('/mon', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
module.exports = router;