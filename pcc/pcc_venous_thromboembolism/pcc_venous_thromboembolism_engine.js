// Hand-written engine — PCC 3.186.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.186.0';
const MOD = 'pcc_venous_thromboembolism';

function VTERiskAssessmentExt(input) {
  const _i = input || {};
  const f = ['recent_surgery', 'immobilization', 'cancer', 'prior_vte', 'ocp', 'obesity', 'thrombophilia'];
  const c = f.filter(x => String(_i[x] || 'no') === 'yes').length;
  const _r = { risk: c >= 3 ? 'high' : c >= 1 ? 'moderate' : 'low', count: c };
  return Object.assign({ version: VER, module: MOD, function: 'VTERiskAssessmentExt', input, ts: TS }, _r);
}

function WellsScoreDVT(input) {
  const _i = input || {};
  let s = 0;
  const checks = ['active_cancer', 'paralysis', 'recent_bedrest', 'tenderness', 'entire_leg_swollen', 'calf_swelling', 'pitting_edema', 'collateral_veins', 'prev_dvt'];
  for (const c of checks) if (String(_i[c] || 'no') === 'yes') s += 1;
  if (String(_i.alternative_dx || 'no') === 'yes') s -= 2;
  const _r = { score: s, prob: s >= 2 ? 'likely' : 'unlikely' };
  return Object.assign({ version: VER, module: MOD, function: 'WellsScoreDVT', input, ts: TS }, _r);
}

function DVTProvokedVsUnprovokedExt(input) {
  const _i = input || {};
  const _r = { category: String(_i.provoked || 'no') === 'yes' ? 'provoked' : 'unprovoked' };
  return Object.assign({ version: VER, module: MOD, function: 'DVTProvokedVsUnprovokedExt', input, ts: TS }, _r);
}

function DVTAnticoagDurationExt(input) {
  const _i = input || {};
  const c = String(_i.cancer || 'no') === 'yes';
  const p = String(_i.provoked || 'no') === 'yes';
  const _r = { recommendation: c ? 'indefinite' : p ? '3-months' : 'extended' };
  return Object.assign({ version: VER, module: MOD, function: 'DVTAnticoagDurationExt', input, ts: TS }, _r);
}

function PERCRuleOutExt(input) {
  const _i = input || {};
  const age = Number(_i.age || 50);
  const hr = Number(_i.hr || 90);
  const spo2 = Number(_i.spo2 || 95);
  let score = (age >= 80 ? 1 : 0) + (hr >= 100 ? 1 : 0) + (spo2 < 95 ? 1 : 0);
  if (String(_i.edema || 'no') === 'yes') score += 1;
  if (String(_i.hemoptysis || 'no') === 'yes') score += 1;
  if (String(_i.surgery || 'no') === 'yes') score += 1;
  if (String(_i.prior_pe || 'no') === 'yes') score += 1;
  const _r = { score, safe_to_discharge: score === 0 };
  return Object.assign({ version: VER, module: MOD, function: 'PERCRuleOutExt', input, ts: TS }, _r);
}

function PESEverityIndexExt(input) {
  const _i = input || {};
  const s = String(_i.shock || 'no') === 'yes';
  const r = String(_i.rv_dysfunction || 'no') === 'yes';
  const _r = { severity: s ? 'massive' : r ? 'submassive' : 'low' };
  return Object.assign({ version: VER, module: MOD, function: 'PESEverityIndexExt', input, ts: TS }, _r);
}

function PEOutpatientCriteriaExt(input) {
  const _i = input || {};
  const _r = { outpatient_eligible: String(_i.shock || 'no') === 'no' && String(_i.rv_dysfunction || 'no') === 'no' && String(_i.comorbid || 'no') === 'no' };
  return Object.assign({ version: VER, module: MOD, function: 'PEOutpatientCriteriaExt', input, ts: TS }, _r);
}

function PostthromboticSyndromeRiskExt(input) {
  const _i = input || {};
  const p = String(_i.proximal || 'no') === 'yes';
  const r = String(_i.recurrent || 'no') === 'yes';
  const _r = { risk: p && r ? 'high' : p ? 'moderate' : 'low' };
  return Object.assign({ version: VER, module: MOD, function: 'PostthromboticSyndromeRiskExt', input, ts: TS }, _r);
}

function IVCFilterIndicationsExt(input) {
  const _i = input || {};
  const _r = { indicated: String(_i.anticoag_contra || 'no') === 'yes' || String(_i.recurrent || 'no') === 'yes' };
  return Object.assign({ version: VER, module: MOD, function: 'IVCFilterIndicationsExt', input, ts: TS }, _r);
}

function ThrombophiliaScreeningExt(input) {
  const _i = input || {};
  const age = Number(_i.age || 40);
  const f = String(_i.family || 'no') === 'yes';
  const u = String(_i.unprovoked || 'no') === 'yes';
  const _r = { indicated: age < 50 || f || u };
  return Object.assign({ version: VER, module: MOD, function: 'ThrombophiliaScreeningExt', input, ts: TS }, _r);
}

module.exports = {
  VTERiskAssessmentExt,
  WellsScoreDVT,
  DVTProvokedVsUnprovokedExt,
  DVTAnticoagDurationExt,
  PERCRuleOutExt,
  PESEverityIndexExt,
  PEOutpatientCriteriaExt,
  PostthromboticSyndromeRiskExt,
  IVCFilterIndicationsExt,
  ThrombophiliaScreeningExt,
};