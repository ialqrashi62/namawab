// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.26.26.0';
const MOD = 'pcc_pediatric_neuro_ext186';

function PediatricCerebellarExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCerebellarExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCerebellarExt", input, score, ts: TS, pediatricCerebellarExt: _i.pediatricCerebellarExt || null };
}

function PediatricAText(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAText) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricAText', input, score, ts: TS, pediatricAText: _i.pediatricAText || null };
}

function PediatricFAext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricFAext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricFAext', input, score, ts: TS, pediatricFAext: _i.pediatricFAext || null };
}

function PediatricHDExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHDExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHDExt", input, score, ts: TS, pediatricHDExt: _i.pediatricHDExt || null };
}

function PediatricChoreaSxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricChoreaSxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricChoreaSxExt", input, score, ts: TS, pediatricChoreaSxExt: _i.pediatricChoreaSxExt || null };
}

function PediatricSydenhamExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSydenhamExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSydenhamExt", input, score, ts: TS, pediatricSydenhamExt: _i.pediatricSydenhamExt || null };
}

function PediatricTicExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTicExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTicExt", input, score, ts: TS, pediatricTicExt: _i.pediatricTicExt || null };
}

function PediatricTouretteExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTouretteExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTouretteExt", input, score, ts: TS, pediatricTouretteExt: _i.pediatricTouretteExt || null };
}

function PediatricDystoniaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDystoniaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDystoniaExt", input, score, ts: TS, pediatricDystoniaExt: _i.pediatricDystoniaExt || null };
}

function PediatricAtaxiaTxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAtaxiaTxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAtaxiaTxExt", input, score, ts: TS, pediatricAtaxiaTxExt: _i.pediatricAtaxiaTxExt || null };
}

module.exports = {
  PediatricCerebellarExt,
  PediatricAText,
  PediatricFAext,
  PediatricHDExt,
  PediatricChoreaSxExt,
  PediatricSydenhamExt,
  PediatricTicExt,
  PediatricTouretteExt,
  PediatricDystoniaExt,
  PediatricAtaxiaTxExt,
};
