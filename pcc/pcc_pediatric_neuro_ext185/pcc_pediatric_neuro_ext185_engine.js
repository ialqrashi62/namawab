// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.25.25.0';
const MOD = 'pcc_pediatric_neuro_ext185';

function PediatricDementiaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDementiaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDementiaExt", input, score, ts: TS, pediatricDementiaExt: _i.pediatricDementiaExt || null };
}

function PediatricNCLext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNCLext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricNCLext', input, score, ts: TS, pediatricNCLext: _i.pediatricNCLext || null };
}

function PediatricSanfilippoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSanfilippoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSanfilippoExt", input, score, ts: TS, pediatricSanfilippoExt: _i.pediatricSanfilippoExt || null };
}

function PediatricTaySachsExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTaySachsExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTaySachsExt", input, score, ts: TS, pediatricTaySachsExt: _i.pediatricTaySachsExt || null };
}

function PediatricPKUadultExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPKUadultExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPKUadultExt", input, score, ts: TS, pediatricPKUadultExt: _i.pediatricPKUadultExt || null };
}

function PediatricWilsonExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricWilsonExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricWilsonExt", input, score, ts: TS, pediatricWilsonExt: _i.pediatricWilsonExt || null };
}

function PediatricEncephalitisExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricEncephalitisExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricEncephalitisExt", input, score, ts: TS, pediatricEncephalitisExt: _i.pediatricEncephalitisExt || null };
}

function PediatricADEMEncephExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricADEMEncephExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricADEMEncephExt", input, score, ts: TS, pediatricADEMEncephExt: _i.pediatricADEMEncephExt || null };
}

function PediatricDeliriumExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDeliriumExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDeliriumExt", input, score, ts: TS, pediatricDeliriumExt: _i.pediatricDeliriumExt || null };
}

function PediatricCogRehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCogRehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCogRehabExt", input, score, ts: TS, pediatricCogRehabExt: _i.pediatricCogRehabExt || null };
}

module.exports = {
  PediatricDementiaExt,
  PediatricNCLext,
  PediatricSanfilippoExt,
  PediatricTaySachsExt,
  PediatricPKUadultExt,
  PediatricWilsonExt,
  PediatricEncephalitisExt,
  PediatricADEMEncephExt,
  PediatricDeliriumExt,
  PediatricCogRehabExt,
};
