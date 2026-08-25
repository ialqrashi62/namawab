// filepath: tier5_rare_ext_102_iem_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_102_iem_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/nbs', asyncH(async (req, res) => res.json(engine.funcs().nbs_interpret(req.body))));
router.post('/amino', asyncH(async (req, res) => res.json(engine.funcs().amino_acid_disorder(req.body))));
router.post('/fao', asyncH(async (req, res) => res.json(engine.funcs().fatty_acid_oxidation(req.body))));
router.post('/lsd', asyncH(async (req, res) => res.json(engine.funcs().lysosomal_storage(req.body))));
router.post('/mito', asyncH(async (req, res) => res.json(engine.funcs().mitochondrial_screen(req.body))));

module.exports = router;
