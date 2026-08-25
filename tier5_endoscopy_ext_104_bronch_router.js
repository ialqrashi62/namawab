// filepath: tier5_endoscopy_ext_104_bronch_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_104_bronch_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/app', asyncH(async (req, res) => res.json(engine.funcs().approach(req.body))));
router.post('/bal', asyncH(async (req, res) => res.json(engine.funcs().bal(req.body))));
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/th', asyncH(async (req, res) => res.json(engine.funcs().therapeutic(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post(req.body))));
module.exports = router;