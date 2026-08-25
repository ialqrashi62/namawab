'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_105_male_infertility_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/semen', asyncH((req, res) => res.json(engine.semenAnalysis(req.body))));
router.post('/varicocele', asyncH((req, res) => res.json(engine.varicocele(req.body))));
module.exports = router;