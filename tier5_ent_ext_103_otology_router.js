// filepath: tier5_ent_ext_103_otology_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_103_otology_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ha', asyncH(async (req, res) => res.json(engine.funcs().hearing_aid(req.body))));
router.post('/om', asyncH(async (req, res) => res.json(engine.funcs().otitis_media(req.body))));
router.post('/oe', asyncH(async (req, res) => res.json(engine.funcs().otitis_ext(req.body))));
router.post('/chol', asyncH(async (req, res) => res.json(engine.funcs().cholesteatoma(req.body))));
router.post('/tin', asyncH(async (req, res) => res.json(engine.funcs().tinnitus(req.body))));
router.post('/coc', asyncH(async (req, res) => res.json(engine.funcs().cochlear(req.body))));
module.exports = router;