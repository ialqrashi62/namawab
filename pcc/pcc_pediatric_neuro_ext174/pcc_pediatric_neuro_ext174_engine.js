// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.14.14.0';
const MOD = 'pcc_pediatric_neuro_ext174';

function PediatricINOExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricINOExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricINOExt", input, score, ts: TS, pediatricINOExt: _i.pediatricINOExt || null };
}

function PediatricOpsoclonusExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOpsoclonusExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOpsoclonusExt", input, score, ts: TS, pediatricOpsoclonusExt: _i.pediatricOpsoclonusExt || null };
}

function PediatricCongNystagmusExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCongNystagmusExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCongNystagmusExt", input, score, ts: TS, pediatricCongNystagmusExt: _i.pediatricCongNystagmusExt || null };
}

function PediatricIIIPalsyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricIIIPalsyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricIIIPalsyExt", input, score, ts: TS, pediatricIIIPalsyExt: _i.pediatricIIIPalsyExt || null };
}

function PediatricVIPalsyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricVIPalsyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricVIPalsyExt", input, score, ts: TS, pediatricVIPalsyExt: _i.pediatricVIPalsyExt || null };
}

function PediatricIVPalsyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricIVPalsyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricIVPalsyExt", input, score, ts: TS, pediatricIVPalsyExt: _i.pediatricIVPalsyExt || null };
}

function PediatricOphthalmoplegiaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricOphthalmoplegiaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricOphthalmoplegiaExt", input, score, ts: TS, pediatricOphthalmoplegiaExt: _i.pediatricOphthalmoplegiaExt || null };
}

function PediatricCPEOExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCPEOExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCPEOExt", input, score, ts: TS, pediatricCPEOExt: _i.pediatricCPEOExt || null };
}

function PediatricLeberHereditaryExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricLeberHereditaryExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricLeberHereditaryExt", input, score, ts: TS, pediatricLeberHereditaryExt: _i.pediatricLeberHereditaryExt || null };
}

function PediatricSupranuclearPalsyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSupranuclearPalsyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSupranuclearPalsyExt", input, score, ts: TS, pediatricSupranuclearPalsyExt: _i.pediatricSupranuclearPalsyExt || null };
}

module.exports = {
  PediatricINOExt,
  PediatricOpsoclonusExt,
  PediatricCongNystagmusExt,
  PediatricIIIPalsyExt,
  PediatricVIPalsyExt,
  PediatricIVPalsyExt,
  PediatricOphthalmoplegiaExt,
  PediatricCPEOExt,
  PediatricLeberHereditaryExt,
  PediatricSupranuclearPalsyExt,
};
