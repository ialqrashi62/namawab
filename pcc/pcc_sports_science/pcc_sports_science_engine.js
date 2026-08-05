// P3_DD pcc_sports_science_engine v3.68.0
'use strict';
function Biomechanics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biomechanics-none';
  if (t === 'yes') plan = 'biomechanics-protocol';
  return { plan, t };
}
function LoadMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'loadmonitoring-none';
  if (t === 'yes') plan = 'loadmonitoring-protocol';
  return { plan, t };
}
function InjuryRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'injuryrisk-none';
  if (t === 'yes') plan = 'injuryrisk-protocol';
  return { plan, t };
}
function ReturnToPlay(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'returntoplay-none';
  if (t === 'yes') plan = 'returntoplay-protocol';
  return { plan, t };
}
function NutritionPeriodization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionperiodization-none';
  if (t === 'yes') plan = 'nutritionperiodization-protocol';
  return { plan, t };
}
function HydrationStrategy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hydrationstrategy-none';
  if (t === 'yes') plan = 'hydrationstrategy-protocol';
  return { plan, t };
}
function RecoveryOptimization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'recoveryoptimization-none';
  if (t === 'yes') plan = 'recoveryoptimization-protocol';
  return { plan, t };
}
function YouthAthlete(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'youthathlete-none';
  if (t === 'yes') plan = 'youthathlete-protocol';
  return { plan, t };
}
function TeamHealth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'teamhealth-none';
  if (t === 'yes') plan = 'teamhealth-protocol';
  return { plan, t };
}
function AltitudeTraining(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'altitudetraining-none';
  if (t === 'yes') plan = 'altitudetraining-protocol';
  return { plan, t };
}
module.exports = {
  Biomechanics, LoadMonitoring, InjuryRisk, ReturnToPlay, NutritionPeriodization, HydrationStrategy, RecoveryOptimization, YouthAthlete, TeamHealth, AltitudeTraining
};
