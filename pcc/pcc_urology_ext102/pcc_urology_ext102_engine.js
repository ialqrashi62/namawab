// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.53.53.0';
const MOD = 'pcc_urology_ext102';

function UroGenExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroGenExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroGenExt", input, score, ts: TS, uroGenExt: _i.uroGenExt || null };
}

function UroBPHext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroBPHext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'UroBPHext', input, score, ts: TS, uroBPHext: _i.uroBPHext || null };
}

function UroProstateExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroProstateExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroProstateExt", input, score, ts: TS, uroProstateExt: _i.uroProstateExt || null };
}

function UroBladderExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroBladderExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroBladderExt", input, score, ts: TS, uroBladderExt: _i.uroBladderExt || null };
}

function UroKidneyExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroKidneyExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroKidneyExt", input, score, ts: TS, uroKidneyExt: _i.uroKidneyExt || null };
}

function UroTesticExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroTesticExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroTesticExt", input, score, ts: TS, uroTesticExt: _i.uroTesticExt || null };
}

function UroIncontExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroIncontExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroIncontExt", input, score, ts: TS, uroIncontExt: _i.uroIncontExt || null };
}

function UroUTIext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroUTIext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'UroUTIext', input, score, ts: TS, uroUTIext: _i.uroUTIext || null };
}

function UroStoneExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroStoneExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "UroStoneExt", input, score, ts: TS, uroStoneExt: _i.uroStoneExt || null };
}

function UroEDext(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.uroEDext) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: 'UroEDext', input, score, ts: TS, uroEDext: _i.uroEDext || null };
}

module.exports = {
  UroGenExt,
  UroBPHext,
  UroProstateExt,
  UroBladderExt,
  UroKidneyExt,
  UroTesticExt,
  UroIncontExt,
  UroUTIext,
  UroStoneExt,
  UroEDext,
};
