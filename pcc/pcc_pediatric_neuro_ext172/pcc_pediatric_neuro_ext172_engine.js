// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.1.12.0';
const MOD = 'pcc_pediatric_neuro_ext172';

function PediatricDemChildExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDemChildExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDemChildExt", input, score, ts: TS, pediatricDemChildExt: _i.pediatricDemChildExt || null };
}

function PediatricNF1cognitiveExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricNF1cognitiveExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricNF1cognitiveExt", input, score, ts: TS, pediatricNF1cognitiveExt: _i.pediatricNF1cognitiveExt || null };
}

function PediatricTSCcogExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricTSCcogExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricTSCcogExt", input, score, ts: TS, pediatricTSCcogExt: _i.pediatricTSCcogExt || null };
}

function Pediatric22q11Ext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatric22q11Ext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "Pediatric22q11Ext", input, score, ts: TS, pediatric22q11Ext: _i.pediatric22q11Ext || null };
}

function PediatricFragileXExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricFragileXExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricFragileXExt", input, score, ts: TS, pediatricFragileXExt: _i.pediatricFragileXExt || null };
}

function PediatricDownCogExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDownCogExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDownCogExt", input, score, ts: TS, pediatricDownCogExt: _i.pediatricDownCogExt || null };
}

function PediatricWilliamsExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricWilliamsExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricWilliamsExt", input, score, ts: TS, pediatricWilliamsExt: _i.pediatricWilliamsExt || null };
}

function PediatricPraderWilliExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPraderWilliExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPraderWilliExt", input, score, ts: TS, pediatricPraderWilliExt: _i.pediatricPraderWilliExt || null };
}

function PediatricAngelmanExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricAngelmanExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricAngelmanExt", input, score, ts: TS, pediatricAngelmanExt: _i.pediatricAngelmanExt || null };
}

function PediatricRettExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricRettExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricRettExt", input, score, ts: TS, pediatricRettExt: _i.pediatricRettExt || null };
}

module.exports = {
  PediatricDemChildExt,
  PediatricNF1cognitiveExt,
  PediatricTSCcogExt,
  Pediatric22q11Ext,
  PediatricFragileXExt,
  PediatricDownCogExt,
  PediatricWilliamsExt,
  PediatricPraderWilliExt,
  PediatricAngelmanExt,
  PediatricRettExt,
};
