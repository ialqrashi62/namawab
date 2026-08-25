// filepath: tier5_derm2_ext_104_hair_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_104_hair_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/androgenic', asyncH(async (req, res) => res.json(engine.funcs().androgenic_alopecia(req.body))));
router.post('/areata', asyncH(async (req, res) => res.json(engine.funcs().alopecia_areata(req.body))));
router.post('/telogen', asyncH(async (req, res) => res.json(engine.funcs().telogen_effluvium(req.body))));
router.post('/minox', asyncH(async (req, res) => res.json(engine.funcs().minoxidil_protocol(req.body))));
router.post('/transplant', asyncH(async (req, res) => res.json(engine.funcs().hair_transplant(req.body))));

module.exports = router;
