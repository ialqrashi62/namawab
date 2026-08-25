// filepath: tier5_pall_care_ext2_104_eol_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_104_eol_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/rec', asyncH(async (req, res) => res.json(engine.funcs().dying_recognition(req.body))));
router.post('/care', asyncH(async (req, res) => res.json(engine.funcs().eol_care(req.body))));
router.post('/sig', asyncH(async (req, res) => res.json(engine.funcs().signs(req.body))));
router.post('/fc', asyncH(async (req, res) => res.json(engine.funcs().family_call(req.body))));
router.post('/vi', asyncH(async (req, res) => res.json(engine.funcs().vigil(req.body))));
router.post('/pro', asyncH(async (req, res) => res.json(engine.funcs().pronouncement(req.body))));
module.exports = router;
