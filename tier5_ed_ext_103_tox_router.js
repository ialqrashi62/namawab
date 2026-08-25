// filepath: tier5_ed_ext_103_tox_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_103_tox_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/overdose', asyncH(async (req, res) => res.json(engine.funcs().overdose(req.body))));
router.post('/antidote', asyncH(async (req, res) => res.json(engine.funcs().antidote(req.body))));
router.post('/enven', asyncH(async (req, res) => res.json(engine.funcs().envenomation(req.body))));
router.post('/withd', asyncH(async (req, res) => res.json(engine.funcs().withdrawal(req.body))));
router.post('/toxidrome', asyncH(async (req, res) => res.json(engine.funcs().toxidrome(req.body))));
router.post('/pcc', asyncH(async (req, res) => res.json(engine.funcs().poison_center(req.body))));

module.exports = router;
