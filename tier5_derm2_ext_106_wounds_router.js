// filepath: tier5_derm2_ext_106_wounds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_106_wounds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/class', asyncH(async (req, res) => res.json(engine.funcs().wound_class(req.body))));
router.post('/braden', asyncH(async (req, res) => res.json(engine.funcs().braden_scale(req.body))));
router.post('/dressing', asyncH(async (req, res) => res.json(engine.funcs().dressing_choice(req.body))));
router.post('/healing', asyncH(async (req, res) => res.json(engine.funcs().healing_check(req.body))));
router.post('/hbpet', asyncH(async (req, res) => res.json(engine.funcs().hb_pet(req.body))));

module.exports = router;
