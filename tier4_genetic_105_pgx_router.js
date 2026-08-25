'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_105_pgx_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/phenotype', asyncH((req, res) => res.json(engine.cpicPhenotypeConvert(req.body))));
router.post('/codeine', asyncH((req, res) => res.json(engine.codeinePrescribing(req.body))));
module.exports = router;