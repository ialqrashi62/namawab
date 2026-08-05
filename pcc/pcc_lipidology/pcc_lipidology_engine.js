// Hand-written engine — PCC 3.185.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.185.0';
const MOD = 'pcc_lipidology';

function LDLTargetExt(input) {
  const _i = input || {};
  const t = { very_high: 55, high: 70, moderate: 100, low: 130 };
  const _r = { target_ldl: t[String(_i.risk || 'moderate')] || 100, risk: _i.risk || 'moderate' };
  return Object.assign({ version: VER, module: MOD, function: 'LDLTargetExt', input, ts: TS }, _r);
}

function StatinIntensityExt(input) {
  const _i = input || {};
  const r = String(_i.risk || 'moderate');
  const _r = { intensity: r === 'very_high' ? 'high-intensity' : r === 'high' ? 'moderate-to-high' : 'moderate' };
  return Object.assign({ version: VER, module: MOD, function: 'StatinIntensityExt', input, ts: TS }, _r);
}

function FamilialHypercholesterolemiaExt(input) {
  const _i = input || {};
  const _r = { fh_likely: Number(_i.ldl || 200) >= 190, ldl: Number(_i.ldl || 200) };
  return Object.assign({ version: VER, module: MOD, function: 'FamilialHypercholesterolemiaExt', input, ts: TS }, _r);
}

function StatinIntoleranceExt(input) {
  const _i = input || {};
  const _r = { likely_intolerant: String(_i.muscle || 'no') === 'yes' && Number(_i.ck || 100) > 3 };
  return Object.assign({ version: VER, module: MOD, function: 'StatinIntoleranceExt', input, ts: TS }, _r);
}

function PCSK9InhibitorCandidateExt(input) {
  const _i = input || {};
  const _r = { eligible: Number(_i.ldl || 100) >= 70 && String(_i.max_statin || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'PCSK9InhibitorCandidateExt', input, ts: TS }, _r);
}

function LipoproteinACalcExt(input) {
  const _i = input || {};
  const _r = { lpa: Number(_i.lpa || 30), elevated: Number(_i.lpa || 30) >= 50 };
  return Object.assign({ version: VER, module: MOD, function: 'LipoproteinACalcExt', input, ts: TS }, _r);
}

function TriglycerideManagementExt(input) {
  const _i = input || {};
  const tg = Number(_i.tg || 200);
  let plan = 'lifestyle';
  if (tg >= 500) plan = 'prevent-pancreatitis';
  else if (tg >= 200) plan = 'add-fibrate-or-icosapent';
  const _r = { plan, tg };
  return Object.assign({ version: VER, module: MOD, function: 'TriglycerideManagementExt', input, ts: TS }, _r);
}

function StatinHepatotoxicityExt(input) {
  const _i = input || {};
  const _r = { risk: Number(_i.alt || 25) > 3 ? 'high' : 'low', alt: Number(_i.alt || 25) };
  return Object.assign({ version: VER, module: MOD, function: 'StatinHepatotoxicityExt', input, ts: TS }, _r);
}

function BempedoicAcidCandidateExt(input) {
  const _i = input || {};
  const _r = { eligible: String(_i.statin_intol || 'no') === 'yes' && Number(_i.ldl || 100) >= 100 };
  return Object.assign({ version: VER, module: MOD, function: 'BempedoicAcidCandidateExt', input, ts: TS }, _r);
}

function ASCVD10YearRiskExt(input) {
  const _i = input || {};
  const age = Number(_i.age || 55);
  const chol = Number(_i.chol || 200);
  const sbp = Number(_i.sbp || 130);
  const smoker = String(_i.smoker || 'no') === 'yes' ? 1 : 0;
  const diabetes = String(_i.diabetes || 'no') === 'yes' ? 1 : 0;
  const score = Math.min(30, Math.round((age - 30) * 0.5 + (chol - 180) * 0.05 + (sbp - 110) * 0.1 + smoker * 5 + diabetes * 5));
  const _r = { score };
  return Object.assign({ version: VER, module: MOD, function: 'ASCVD10YearRiskExt', input, ts: TS }, _r);
}

module.exports = {
  LDLTargetExt,
  StatinIntensityExt,
  FamilialHypercholesterolemiaExt,
  StatinIntoleranceExt,
  PCSK9InhibitorCandidateExt,
  LipoproteinACalcExt,
  TriglycerideManagementExt,
  StatinHepatotoxicityExt,
  BempedoicAcidCandidateExt,
  ASCVD10YearRiskExt,
};