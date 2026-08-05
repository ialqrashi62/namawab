// Hand-written engine — PCC 3.184.0
"use strict";
const TS = '2026-07-29T12:00:00Z';
const VER = '3.184.0';
const MOD = 'pcc_cardiac_rehab_ext';

function CRPhaseProgressionExt(input) {
  const _i = input || {};
  const p = Number(_i.phase || 1);
  const _r = { current_phase: p, next_phase: p < 4 ? p + 1 : 4 };
  return Object.assign({ version: VER, module: MOD, function: 'CRPhaseProgressionExt', input, ts: TS }, _r);
}

function METsTargetCalculationExt(input) {
  const _i = input || {};
  const _r = { mets_target: Math.round((220 - Number(_i.age || 60)) * 0.6 / 10) / 10, age: Number(_i.age || 60) };
  return Object.assign({ version: VER, module: MOD, function: 'METsTargetCalculationExt', input, ts: TS }, _r);
}

function RPEGuidedExerciseExt(input) {
  const _i = input || {};
  const r = Number(_i.rpe || 11);
  const _r = { rpe: r, zone: r < 11 ? 'light' : r >= 14 ? 'vigorous' : 'moderate' };
  return Object.assign({ version: VER, module: MOD, function: 'RPEGuidedExerciseExt', input, ts: TS }, _r);
}

function CRContraindicationCheckExt(input) {
  const _i = input || {};
  const c = ['unstable_angina', 'uncontrolled_arrhythmia', 'severe_stenosis', 'recent_pe'];
  const has = c.filter(x => String(_i[x] || 'no') === 'yes');
  const _r = { safe_to_start: has.length === 0, contra: has };
  return Object.assign({ version: VER, module: MOD, function: 'CRContraindicationCheckExt', input, ts: TS }, _r);
}

function CREnrollmentRateExt(input) {
  const _i = input || {};
  const _r = { rate: Math.round((Number(_i.enrolled || 50) / Number(_i.eligible || 100)) * 100) / 100, eligible: Number(_i.eligible || 100), enrolled: Number(_i.enrolled || 50) };
  return Object.assign({ version: VER, module: MOD, function: 'CREnrollmentRateExt', input, ts: TS }, _r);
}

function AerobicIntervalPrescriptionExt(input) {
  const _i = input || {};
  const hrR = Number(_i.hr_rest || 70);
  const hrM = Number(_i.hr_max || 150);
  const _r = { interval_hr_bpm: Math.round(hrR + (hrM - hrR) * 0.85) };
  return Object.assign({ version: VER, module: MOD, function: 'AerobicIntervalPrescriptionExt', input, ts: TS }, _r);
}

function ResistanceTrainingSafetyExt(input) {
  const _i = input || {};
  const _r = { safe: Number(_i.sbp || 120) < 160, sbp: Number(_i.sbp || 120) };
  return Object.assign({ version: VER, module: MOD, function: 'ResistanceTrainingSafetyExt', input, ts: TS }, _r);
}

function CRCompletionPredictorExt(input) {
  const _i = input || {};
  const f = ['insurance', 'transportation', 'work_schedule', 'family_support', 'motivation'];
  const p = f.filter(x => String(_i[x] || 'no') === 'yes').length;
  const _r = { likely_to_complete: p >= 3, score: p };
  return Object.assign({ version: VER, module: MOD, function: 'CRCompletionPredictorExt', input, ts: TS }, _r);
}

function HomeCRvsCenterExt(input) {
  const _i = input || {};
  const _r = { recommendation: Number(_i.distance_km || 5) > 30 || String(_i.preference || 'center') === 'home' ? 'home-based' : 'center-based' };
  return Object.assign({ version: VER, module: MOD, function: 'HomeCRvsCenterExt', input, ts: TS }, _r);
}

function CRFollowupEchoExt(input) {
  const _i = input || {};
  const _r = { echo_needed: Number(_i.months || 3) <= 6, months_post_mi: Number(_i.months || 3) };
  return Object.assign({ version: VER, module: MOD, function: 'CRFollowupEchoExt', input, ts: TS }, _r);
}

module.exports = {
  CRPhaseProgressionExt,
  METsTargetCalculationExt,
  RPEGuidedExerciseExt,
  CRContraindicationCheckExt,
  CREnrollmentRateExt,
  AerobicIntervalPrescriptionExt,
  ResistanceTrainingSafetyExt,
  CRCompletionPredictorExt,
  HomeCRvsCenterExt,
  CRFollowupEchoExt,
};