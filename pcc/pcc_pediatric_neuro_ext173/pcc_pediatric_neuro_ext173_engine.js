// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.13.13.0';
const MOD = 'pcc_pediatric_neuro_ext173';

function PediatricPituitaryApoplexyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPituitaryApoplexyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPituitaryApoplexyExt", input, score, ts: TS, pediatricPituitaryApoplexyExt: _i.pediatricPituitaryApoplexyExt || null };
}

function PediatricEmptySellaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricEmptySellaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricEmptySellaExt", input, score, ts: TS, pediatricEmptySellaExt: _i.pediatricEmptySellaExt || null };
}

function PediatricLymphHypoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricLymphHypoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricLymphHypoExt", input, score, ts: TS, pediatricLymphHypoExt: _i.pediatricLymphHypoExt || null };
}

function PediatricDIneonatalExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricDIneonatalExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricDIneonatalExt", input, score, ts: TS, pediatricDIneonatalExt: _i.pediatricDIneonatalExt || null };
}

function PediatricSIADHpostOpExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricSIADHpostOpExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricSIADHpostOpExt", input, score, ts: TS, pediatricSIADHpostOpExt: _i.pediatricSIADHpostOpExt || null };
}

function PediatricHypopitExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHypopitExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHypopitExt", input, score, ts: TS, pediatricHypopitExt: _i.pediatricHypopitExt || null };
}

function PediatricPituitaryPostopExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPituitaryPostopExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPituitaryPostopExt", input, score, ts: TS, pediatricPituitaryPostopExt: _i.pediatricPituitaryPostopExt || null };
}

function PediatricCraniopharyngiomaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricCraniopharyngiomaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricCraniopharyngiomaExt", input, score, ts: TS, pediatricCraniopharyngiomaExt: _i.pediatricCraniopharyngiomaExt || null };
}

function PediatricHypopitTxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricHypopitTxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricHypopitTxExt", input, score, ts: TS, pediatricHypopitTxExt: _i.pediatricHypopitTxExt || null };
}

function PediatricPitApoplexyCritExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.pediatricPitApoplexyCritExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "PediatricPitApoplexyCritExt", input, score, ts: TS, pediatricPitApoplexyCritExt: _i.pediatricPitApoplexyCritExt || null };
}

module.exports = {
  PediatricPituitaryApoplexyExt,
  PediatricEmptySellaExt,
  PediatricLymphHypoExt,
  PediatricDIneonatalExt,
  PediatricSIADHpostOpExt,
  PediatricHypopitExt,
  PediatricPituitaryPostopExt,
  PediatricCraniopharyngiomaExt,
  PediatricHypopitTxExt,
  PediatricPitApoplexyCritExt,
};
