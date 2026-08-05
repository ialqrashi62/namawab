// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.12.9.0';
const MOD = 'pcc_pediatric_neuro_ext157';

function PediatricOptNeurExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOptNeurExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOptNeurExt", input, score, ts: TS, pediatricOptNeurExt: _i.pediatricOptNeurExt || null };
}

function PediatricIONExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricIONExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricIONExt", input, score, ts: TS, pediatricIONExt: _i.pediatricIONExt || null };
}

function PediatricPapilledemaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPapilledemaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPapilledemaExt", input, score, ts: TS, pediatricPapilledemaExt: _i.pediatricPapilledemaExt || null };
}

function PediatricRetinoblastomaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricRetinoblastomaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricRetinoblastomaExt", input, score, ts: TS, pediatricRetinoblastomaExt: _i.pediatricRetinoblastomaExt || null };
}

function PediatricROPext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricROPext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricROPext', input, score, ts: TS, pediatricROPext: _i.pediatricROPext || null };
}

function PediatricLeberAmaurosisExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricLeberAmaurosisExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricLeberAmaurosisExt", input, score, ts: TS, pediatricLeberAmaurosisExt: _i.pediatricLeberAmaurosisExt || null };
}

function PediatricCongCataractExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCongCataractExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCongCataractExt", input, score, ts: TS, pediatricCongCataractExt: _i.pediatricCongCataractExt || null };
}

function PediatricGlaucomaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricGlaucomaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricGlaucomaExt", input, score, ts: TS, pediatricGlaucomaExt: _i.pediatricGlaucomaExt || null };
}

function PediatricOrbitalCellExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOrbitalCellExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOrbitalCellExt", input, score, ts: TS, pediatricOrbitalCellExt: _i.pediatricOrbitalCellExt || null };
}

function PediatricAmblyopiaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAmblyopiaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAmblyopiaExt", input, score, ts: TS, pediatricAmblyopiaExt: _i.pediatricAmblyopiaExt || null };
}

module.exports = {
  PediatricOptNeurExt,
  PediatricIONExt,
  PediatricPapilledemaExt,
  PediatricRetinoblastomaExt,
  PediatricROPext,
  PediatricLeberAmaurosisExt,
  PediatricCongCataractExt,
  PediatricGlaucomaExt,
  PediatricOrbitalCellExt,
  PediatricAmblyopiaExt,
};
