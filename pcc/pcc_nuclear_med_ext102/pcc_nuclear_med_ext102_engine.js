// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.76.76.0';
const MOD = 'pcc_nuclear_med_ext102';

function NMGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMGenExt", input, score, ts: TS, nMGenExt: _i.nMGenExt || null };
}

function NMPEText(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMPEText) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'NMPEText', input, score, ts: TS, nMPEText: _i.nMPEText || null };
}

function NMSPECText(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMSPECText) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'NMSPECText', input, score, ts: TS, nMSPECText: _i.nMSPECText || null };
}

function NMScanExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMScanExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMScanExt", input, score, ts: TS, nMScanExt: _i.nMScanExt || null };
}

function NMThyroidExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMThyroidExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMThyroidExt", input, score, ts: TS, nMThyroidExt: _i.nMThyroidExt || null };
}

function NMBoneExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMBoneExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMBoneExt", input, score, ts: TS, nMBoneExt: _i.nMBoneExt || null };
}

function NMCardiacExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMCardiacExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMCardiacExt", input, score, ts: TS, nMCardiacExt: _i.nMCardiacExt || null };
}

function NMRadioExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMRadioExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMRadioExt", input, score, ts: TS, nMRadioExt: _i.nMRadioExt || null };
}

function NMDoseExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMDoseExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMDoseExt", input, score, ts: TS, nMDoseExt: _i.nMDoseExt || null };
}

function NMQualityExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nMQualityExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NMQualityExt", input, score, ts: TS, nMQualityExt: _i.nMQualityExt || null };
}

module.exports = {
  NMGenExt,
  NMPEText,
  NMSPECText,
  NMScanExt,
  NMThyroidExt,
  NMBoneExt,
  NMCardiacExt,
  NMRadioExt,
  NMDoseExt,
  NMQualityExt,
};
