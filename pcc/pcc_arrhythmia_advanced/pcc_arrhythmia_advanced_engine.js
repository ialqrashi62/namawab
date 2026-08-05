// Hand-written engine — PCC 3.185.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.185.0';
const MOD = 'pcc_arrhythmia_advanced';

function CHA2DS2VASCRecalcExt(input) {
  const _i = input || {};
  let s = 0;
  if (_i.chf === 'yes') s += 1;
  if (_i.htn === 'yes') s += 1;
  if (_i.age >= 75) s += 2;
  else if (_i.age >= 65) s += 1;
  if (_i.diabetes === 'yes') s += 1;
  if (_i.stroke === 'yes') s += 2;
  if (_i.vascular === 'yes') s += 1;
  if (_i.female === 'yes') s += 1;
  const _r = { score: s, recommend: s >= 2 ? 'anticoagulation' : s === 1 ? 'consider' : 'none' };
  return Object.assign({ version: VER, module: MOD, function: 'CHA2DS2VASCRecalcExt', input, ts: TS }, _r);
}

function HASBLEDRecalcExt(input) {
  const _i = input || {};
  const f = ['htn', 'abnormal_renal', 'abnormal_liver', 'stroke', 'bleeding', 'labile_inr', 'elderly', 'drugs', 'alcohol'];
  const s = f.filter(x => String(_i[x] || 'no') === 'yes').length;
  const _r = { score: s, risk: s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low' };
  return Object.assign({ version: VER, module: MOD, function: 'HASBLEDRecalcExt', input, ts: TS }, _r);
}

function DOACvsWarfarinExt(input) {
  const _i = input || {};
  const _r = { doac_appropriate: String(_i.mech_valve || 'no') !== 'yes' && String(_i.severe_ms || 'no') !== 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'DOACvsWarfarinExt', input, ts: TS }, _r);
}

function AFStrokeMechanismExt(input) {
  const _i = input || {};
  const _r = { mechanism: String(_i.laa || 'yes') === 'yes' ? 'LAA-thrombus' : 'non-LAA' };
  return Object.assign({ version: VER, module: MOD, function: 'AFStrokeMechanismExt', input, ts: TS }, _r);
}

function LAAClosureCandidateExt(input) {
  const _i = input || {};
  const _r = { eligible: String(_i.anticoag_contra || 'no') === 'yes' && Number(_i.chads_vasc || 0) >= 2 };
  return Object.assign({ version: VER, module: MOD, function: 'LAAClosureCandidateExt', input, ts: TS }, _r);
}

function VTStormProtocolExt(input) {
  const _i = input || {};
  const _r = { vt_storm: Number(_i.episodes_24h || 0) >= 3 };
  return Object.assign({ version: VER, module: MOD, function: 'VTStormProtocolExt', input, ts: TS }, _r);
}

function SuddenCardiacDeathRiskExt(input) {
  const _i = input || {};
  const _r = { icd_indicated: Number(_i.ef || 30) <= 35 && (String(_i.nyha || 'II') === 'II' || String(_i.nyha || 'II') === 'III') };
  return Object.assign({ version: VER, module: MOD, function: 'SuddenCardiacDeathRiskExt', input, ts: TS }, _r);
}

function AnticoagBleedRiskNetExt(input) {
  const _i = input || {};
  const _r = { net_benefit: Number(_i.chads_vasc || 0) - Number(_i.has_bled || 0) };
  return Object.assign({ version: VER, module: MOD, function: 'AnticoagBleedRiskNetExt', input, ts: TS }, _r);
}

function AFBurdenMonitorExt(input) {
  const _i = input || {};
  const b = Number(_i.burden_pct || 5);
  const _r = { category: b < 1 ? 'paroxysmal-rare' : b < 50 ? 'paroxysmal' : 'persistent-high-burden', burden_pct: b };
  return Object.assign({ version: VER, module: MOD, function: 'AFBurdenMonitorExt', input, ts: TS }, _r);
}

function RateControlTargetExt(input) {
  const _i = input || {};
  const lvef = Number(_i.lvef || 50);
  const _r = { target_hr: lvef < 40 ? 80 : 110, lvef };
  return Object.assign({ version: VER, module: MOD, function: 'RateControlTargetExt', input, ts: TS }, _r);
}

module.exports = {
  CHA2DS2VASCRecalcExt,
  HASBLEDRecalcExt,
  DOACvsWarfarinExt,
  AFStrokeMechanismExt,
  LAAClosureCandidateExt,
  VTStormProtocolExt,
  SuddenCardiacDeathRiskExt,
  AnticoagBleedRiskNetExt,
  AFBurdenMonitorExt,
  RateControlTargetExt,
};