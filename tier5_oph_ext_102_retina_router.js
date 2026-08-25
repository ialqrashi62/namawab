// filepath: tier5_oph_ext_102_retina_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_102_retina_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/amd', asyncH(async (req, res) => res.json(engine.funcs().amd(req.body))));
router.post('/dr', asyncH(async (req, res) => res.json(engine.funcs().diabetic(req.body))));
router.post('/rd', asyncH(async (req, res) => res.json(engine.funcs().rd(req.body))));
router.post('/av', asyncH(async (req, res) => res.json(engine.funcs().anti_vegf(req.body))));
router.post('/laser', asyncH(async (req, res) => res.json(engine.funcs().laser(req.body))));
router.post('/ppv', asyncH(async (req, res) => res.json(engine.funcs().vitrectomy(req.body))));
module.exports = router;