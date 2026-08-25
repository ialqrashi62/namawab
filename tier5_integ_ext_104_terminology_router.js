'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_104_terminology_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/icd_to_snomed', asyncH((req, res) => res.json(engine.icd10_to_snomed(req.body || {}))));
r.post('/snomed_to_icd', asyncH((req, res) => res.json(engine.snomed_to_icd10(req.body || {}))));
r.post('/rxnorm', asyncH((req, res) => res.json(engine.rxnorm_drug_check(req.body || {}))));
module.exports = r;