// filepath: tier5_derm2_ext_103_eczema_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_103_eczema_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/scrorad', asyncH(async (req, res) => res.json(engine.funcs().scrorad(req.body))));
router.post('/severity', asyncH(async (req, res) => res.json(engine.funcs().atopic_severity(req.body))));
router.post('/dupilumab', asyncH(async (req, res) => res.json(engine.funcs().dupilumab(req.body))));
router.post('/contact', asyncH(async (req, res) => res.json(engine.funcs().contact_dermatitis(req.body))));
router.post('/moisturize', asyncH(async (req, res) => res.json(engine.funcs().moisturize_protocol(req.body))));

module.exports = router;
