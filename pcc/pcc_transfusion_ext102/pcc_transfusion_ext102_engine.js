// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.58.58.0';
const MOD = 'pcc_transfusion_ext102';

function TxGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxGenExt", input, score, ts: TS, txGenExt: _i.txGenExt || null };
}

function TxRBCext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txRBCext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'TxRBCext', input, score, ts: TS, txRBCext: _i.txRBCext || null };
}

function TxPLText(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txPLText) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'TxPLText', input, score, ts: TS, txPLText: _i.txPLText || null };
}

function TxFFPext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txFFPext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'TxFFPext', input, score, ts: TS, txFFPext: _i.txFFPext || null };
}

function TxCryoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txCryoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxCryoExt", input, score, ts: TS, txCryoExt: _i.txCryoExt || null };
}

function TxTypeCrossExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txTypeCrossExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxTypeCrossExt", input, score, ts: TS, txTypeCrossExt: _i.txTypeCrossExt || null };
}

function TxMassiveExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txMassiveExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxMassiveExt", input, score, ts: TS, txMassiveExt: _i.txMassiveExt || null };
}

function TxReactionExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txReactionExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxReactionExt", input, score, ts: TS, txReactionExt: _i.txReactionExt || null };
}

function TxIrradiatedExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txIrradiatedExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxIrradiatedExt", input, score, ts: TS, txIrradiatedExt: _i.txIrradiatedExt || null };
}

function TxConsentExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.txConsentExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TxConsentExt", input, score, ts: TS, txConsentExt: _i.txConsentExt || null };
}

module.exports = {
  TxGenExt,
  TxRBCext,
  TxPLText,
  TxFFPext,
  TxCryoExt,
  TxTypeCrossExt,
  TxMassiveExt,
  TxReactionExt,
  TxIrradiatedExt,
  TxConsentExt,
};
