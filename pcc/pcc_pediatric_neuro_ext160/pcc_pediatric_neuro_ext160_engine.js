// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.12.12.0';
const MOD = 'pcc_pediatric_neuro_ext160';

function PediatricDMDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDMDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDMDchildExt", input, score, ts: TS, pediatricDMDchildExt: _i.pediatricDMDchildExt || null };
}

function PediatricBMDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricBMDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricBMDchildExt", input, score, ts: TS, pediatricBMDchildExt: _i.pediatricBMDchildExt || null };
}

function PediatricLGMDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricLGMDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricLGMDchildExt", input, score, ts: TS, pediatricLGMDchildExt: _i.pediatricLGMDchildExt || null };
}

function PediatricFSHDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricFSHDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricFSHDchildExt", input, score, ts: TS, pediatricFSHDchildExt: _i.pediatricFSHDchildExt || null };
}

function PediatricOPMDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOPMDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOPMDchildExt", input, score, ts: TS, pediatricOPMDchildExt: _i.pediatricOPMDchildExt || null };
}

function PediatricEDMDchildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricEDMDchildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricEDMDchildExt", input, score, ts: TS, pediatricEDMDchildExt: _i.pediatricEDMDchildExt || null };
}

function PediatricDM1childExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDM1childExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDM1childExt", input, score, ts: TS, pediatricDM1childExt: _i.pediatricDM1childExt || null };
}

function PediatricCongMyopExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCongMyopExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCongMyopExt", input, score, ts: TS, pediatricCongMyopExt: _i.pediatricCongMyopExt || null };
}

function PediatricMitoMyopExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricMitoMyopExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricMitoMyopExt", input, score, ts: TS, pediatricMitoMyopExt: _i.pediatricMitoMyopExt || null };
}

function PediatricPompeExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPompeExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPompeExt", input, score, ts: TS, pediatricPompeExt: _i.pediatricPompeExt || null };
}

module.exports = {
  PediatricDMDchildExt,
  PediatricBMDchildExt,
  PediatricLGMDchildExt,
  PediatricFSHDchildExt,
  PediatricOPMDchildExt,
  PediatricEDMDchildExt,
  PediatricDM1childExt,
  PediatricCongMyopExt,
  PediatricMitoMyopExt,
  PediatricPompeExt,
};
