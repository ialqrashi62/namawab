// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.73.73.0';
const MOD = 'pcc_nurse_practitioner_ext102';

function NPGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPGenExt", input, score, ts: TS, nPGenExt: _i.nPGenExt || null };
}

function NPAssessExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPAssessExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPAssessExt", input, score, ts: TS, nPAssessExt: _i.nPAssessExt || null };
}

function NPDiagnosisExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPDiagnosisExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPDiagnosisExt", input, score, ts: TS, nPDiagnosisExt: _i.nPDiagnosisExt || null };
}

function NPTreatExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPTreatExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPTreatExt", input, score, ts: TS, nPTreatExt: _i.nPTreatExt || null };
}

function NPRxExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPRxExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPRxExt", input, score, ts: TS, nPRxExt: _i.nPRxExt || null };
}

function NPFollowExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPFollowExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPFollowExt", input, score, ts: TS, nPFollowExt: _i.nPFollowExt || null };
}

function NPEduExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPEduExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPEduExt", input, score, ts: TS, nPEduExt: _i.nPEduExt || null };
}

function NPConsultExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPConsultExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPConsultExt", input, score, ts: TS, nPConsultExt: _i.nPConsultExt || null };
}

function NPSpecialtyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPSpecialtyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPSpecialtyExt", input, score, ts: TS, nPSpecialtyExt: _i.nPSpecialtyExt || null };
}

function NPQualityExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.nPQualityExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "NPQualityExt", input, score, ts: TS, nPQualityExt: _i.nPQualityExt || null };
}

module.exports = {
  NPGenExt,
  NPAssessExt,
  NPDiagnosisExt,
  NPTreatExt,
  NPRxExt,
  NPFollowExt,
  NPEduExt,
  NPConsultExt,
  NPSpecialtyExt,
  NPQualityExt,
};
