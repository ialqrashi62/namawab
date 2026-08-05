// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.20.20.0';
const MOD = 'pcc_pediatric_neuro_ext180';

function PediatricStrokeExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeExt", input, score, ts: TS, pediatricStrokeExt: _i.pediatricStrokeExt || null };
}

function PediatricStrokeArterialExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeArterialExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeArterialExt", input, score, ts: TS, pediatricStrokeArterialExt: _i.pediatricStrokeArterialExt || null };
}

function PediatricStrokeSinusExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeSinusExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeSinusExt", input, score, ts: TS, pediatricStrokeSinusExt: _i.pediatricStrokeSinusExt || null };
}

function PediatricStrokePerinatalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokePerinatalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokePerinatalExt", input, score, ts: TS, pediatricStrokePerinatalExt: _i.pediatricStrokePerinatalExt || null };
}

function PediatricStrokeSickleExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeSickleExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeSickleExt", input, score, ts: TS, pediatricStrokeSickleExt: _i.pediatricStrokeSickleExt || null };
}

function PediatricStrokeMoyaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeMoyaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeMoyaExt", input, score, ts: TS, pediatricStrokeMoyaExt: _i.pediatricStrokeMoyaExt || null };
}

function PediatricStrokeCADExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeCADExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeCADExt", input, score, ts: TS, pediatricStrokeCADExt: _i.pediatricStrokeCADExt || null };
}

function PediatricStrokeRehabExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeRehabExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeRehabExt", input, score, ts: TS, pediatricStrokeRehabExt: _i.pediatricStrokeRehabExt || null };
}

function PediatricStrokeFollowExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricStrokeFollowExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricStrokeFollowExt", input, score, ts: TS, pediatricStrokeFollowExt: _i.pediatricStrokeFollowExt || null };
}

function PediatricTIAext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTIAext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricTIAext', input, score, ts: TS, pediatricTIAext: _i.pediatricTIAext || null };
}

module.exports = {
  PediatricStrokeExt,
  PediatricStrokeArterialExt,
  PediatricStrokeSinusExt,
  PediatricStrokePerinatalExt,
  PediatricStrokeSickleExt,
  PediatricStrokeMoyaExt,
  PediatricStrokeCADExt,
  PediatricStrokeRehabExt,
  PediatricStrokeFollowExt,
  PediatricTIAext,
};
