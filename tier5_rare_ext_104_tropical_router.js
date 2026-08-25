// filepath: tier5_rare_ext_104_tropical_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_104_tropical_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/tb', asyncH(async (req, res) => res.json(engine.funcs().tb_screen(req.body))));
router.post('/leish', asyncH(async (req, res) => res.json(engine.funcs().leishmaniasis(req.body))));
router.post('/bruc', asyncH(async (req, res) => res.json(engine.funcs().brucellosis(req.body))));
router.post('/anthrax', asyncH(async (req, res) => res.json(engine.funcs().anthrax_exposure(req.body))));
router.post('/vhf', asyncH(async (req, res) => res.json(engine.funcs().viral_hemorrhagic_screen(req.body))));

module.exports = router;
