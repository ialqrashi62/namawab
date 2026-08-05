// Hand-written engine — PCC 3.184.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.184.0';
const MOD = 'pcc_pulmonary_hypertension';

function PHRiskAssessmentExt(input) {
  const _i = input || {};
  const mpap = Number(_i.mpap || 20);
  const pcwp = Number(_i.pcwp || 8);
  const pvr = Number(_i.pvr || 1.5);
  let group = '1';
  if (mpap >= 20 && pcwp <= 15 && pvr > 2) group = '1-pulmonary-arterial';
  else if (mpap >= 20 && pcwp > 15) group = '2-LHD';
  else if (mpap >= 20) group = '3-lung-disease';
  const _r = { group, risk: mpap >= 35 ? 'high' : 'low' };
  return Object.assign({ version: VER, module: MOD, function: 'PHRiskAssessmentExt', input, ts: TS }, _r);
}

function REVEALScoreCalculatorExt(input) {
  const _i = input || {};
  const factors = ['subgroup_1', 'demographics', 'comorbidities', 'six_mw', 'bnp', 'echo', 'pvr', 'renal'];
  const score = factors.filter(f => Number(_i[f] || 0) > 0).length;
  const _r = { score, risk: score >= 7 ? 'high' : score >= 4 ? 'intermediate' : 'low' };
  return Object.assign({ version: VER, module: MOD, function: 'REVEALScoreCalculatorExt', input, ts: TS }, _r);
}

function PAHInitialTherapyExt(input) {
  const _i = input || {};
  const risk = String(_i.risk || 'low');
  const era = String(_i.era || 'no') === 'yes';
  const pde5 = String(_i.pde5 || 'no') === 'yes';
  let rec = 'CCB-trial';
  if (risk === 'high') rec = era && pde5 ? 'parenteral-prostacyclin' : 'escalate-to-combination';
  else if (risk === 'intermediate') rec = era || pde5 ? 'oral-combination' : 'start-monotherapy';
  const _r = { recommendation: rec };
  return Object.assign({ version: VER, module: MOD, function: 'PAHInitialTherapyExt', input, ts: TS }, _r);
}

function BalloonPulmonaryAngioplastyCandidateExt(input) {
  const _i = input || {};
  const ctph = String(_i.cteph || 'no') === 'yes';
  const operable = String(_i.operable || 'no') === 'yes';
  const _r = { bpa_candidate: ctph && !operable, ctph };
  return Object.assign({ version: VER, module: MOD, function: 'BalloonPulmonaryAngioplastyCandidateExt', input, ts: TS }, _r);
}

function CTEPHSurgeryRiskExt(input) {
  const _i = input || {};
  const age = Number(_i.age || 60);
  const comorb = Number(_i.comorb_count || 0);
  const _r = { risk: age > 70 || comorb >= 2 ? 'high' : age > 60 ? 'moderate' : 'low', age, comorb };
  return Object.assign({ version: VER, module: MOD, function: 'CTEPHSurgeryRiskExt', input, ts: TS }, _r);
}

function RiociguatInitiationExt(input) {
  const _i = input || {};
  const sbp = Number(_i.sbp || 120);
  const _r = { eligible: sbp >= 95, sbp, next: sbp >= 95 ? 'start-1mg-tid' : 'defer' };
  return Object.assign({ version: VER, module: MOD, function: 'RiociguatInitiationExt', input, ts: TS }, _r);
}

function PHFollowupIntervalExt(input) {
  const _i = input || {};
  const risk = String(_i.risk || 'low');
  const _r = { interval_months: risk === 'high' ? 3 : risk === 'intermediate' ? 6 : 12, risk };
  return Object.assign({ version: VER, module: MOD, function: 'PHFollowupIntervalExt', input, ts: TS }, _r);
}

function EisenmengerSyndromeRiskExt(input) {
  const _i = input || {};
  const score = (String(_i.shunt || 'no') === 'yes' ? 0.5 : 0) + (String(_i.reversal || 'no') === 'yes' ? 0.5 : 0);
  const _r = { eisenmenger: score === 1, score };
  return Object.assign({ version: VER, module: MOD, function: 'EisenmengerSyndromeRiskExt', input, ts: TS }, _r);
}

function PHMedicationAdherenceExt(input) {
  const _i = input || {};
  const mpr = Number(_i.mpr || 0.8);
  let tier = 'good';
  if (mpr < 0.6) tier = 'poor';
  else if (mpr < 0.8) tier = 'moderate';
  const _r = { mpr, tier };
  return Object.assign({ version: VER, module: MOD, function: 'PHMedicationAdherenceExt', input, ts: TS }, _r);
}

function PregnancyContraPHMedicationExt(input) {
  const _i = input || {};
  const onERA = String(_i.era || 'no') === 'yes';
  const _r = { pregnancy_safe: !onERA, warning: onERA ? 'stop-ERA-pre-conception' : 'continue' };
  return Object.assign({ version: VER, module: MOD, function: 'PregnancyContraPHMedicationExt', input, ts: TS }, _r);
}

module.exports = {
  PHRiskAssessmentExt,
  REVEALScoreCalculatorExt,
  PAHInitialTherapyExt,
  BalloonPulmonaryAngioplastyCandidateExt,
  CTEPHSurgeryRiskExt,
  RiociguatInitiationExt,
  PHFollowupIntervalExt,
  EisenmengerSyndromeRiskExt,
  PHMedicationAdherenceExt,
  PregnancyContraPHMedicationExt,
};