'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_derm_ext_101_skin_cancer_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/abcde', asyncH((req, res) => res.json(engine.melanomaCheck(req.body))));
router.post('/treatment', asyncH((req, res) => res.json(engine.nonmelanomaSkinCancerTreatment(req.body))));
module.exports = router;