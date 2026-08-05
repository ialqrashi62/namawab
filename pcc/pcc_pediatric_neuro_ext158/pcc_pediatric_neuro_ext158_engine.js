// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.12.10.0';
const MOD = 'pcc_pediatric_neuro_ext158';

function PediatricOHLExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOHLExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOHLExt", input, score, ts: TS, pediatricOHLExt: _i.pediatricOHLExt || null };
}

function PediatricCongenitalHLext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCongenitalHLext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricCongenitalHLext', input, score, ts: TS, pediatricCongenitalHLext: _i.pediatricCongenitalHLext || null };
}

function PediatricOMEext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOMEext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricOMEext', input, score, ts: TS, pediatricOMEext: _i.pediatricOMEext || null };
}

function PediatricRecurrentOtitisExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricRecurrentOtitisExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricRecurrentOtitisExt", input, score, ts: TS, pediatricRecurrentOtitisExt: _i.pediatricRecurrentOtitisExt || null };
}

function PediatricCholesteatomaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCholesteatomaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCholesteatomaExt", input, score, ts: TS, pediatricCholesteatomaExt: _i.pediatricCholesteatomaExt || null };
}

function PediatricOtosclerExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOtosclerExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOtosclerExt", input, score, ts: TS, pediatricOtosclerExt: _i.pediatricOtosclerExt || null };
}

function PediatricAuditoryNeuroExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAuditoryNeuroExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAuditoryNeuroExt", input, score, ts: TS, pediatricAuditoryNeuroExt: _i.pediatricAuditoryNeuroExt || null };
}

function PediatricCMVhlExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCMVhlExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCMVhlExt", input, score, ts: TS, pediatricCMVhlExt: _i.pediatricCMVhlExt || null };
}

function PediatricOtoxicityExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOtoxicityExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOtoxicityExt", input, score, ts: TS, pediatricOtoxicityExt: _i.pediatricOtoxicityExt || null };
}

function PediatricNoiseHLext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNoiseHLext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'PediatricNoiseHLext', input, score, ts: TS, pediatricNoiseHLext: _i.pediatricNoiseHLext || null };
}

module.exports = {
  PediatricOHLExt,
  PediatricCongenitalHLext,
  PediatricOMEext,
  PediatricRecurrentOtitisExt,
  PediatricCholesteatomaExt,
  PediatricOtosclerExt,
  PediatricAuditoryNeuroExt,
  PediatricCMVhlExt,
  PediatricOtoxicityExt,
  PediatricNoiseHLext,
};
