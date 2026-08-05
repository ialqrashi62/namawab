// P3_DD pcc_performance_medicine_engine v3.68.0
'use strict';
function VO2Max(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vo2max-none';
  if (t === 'yes') plan = 'vo2max-protocol';
  return { plan, t };
}
function LactateThreshold(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lactatethreshold-none';
  if (t === 'yes') plan = 'lactatethreshold-protocol';
  return { plan, t };
}
function MovementScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'movementscreen-none';
  if (t === 'yes') plan = 'movementscreen-protocol';
  return { plan, t };
}
function CognitivePerformance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cognitiveperformance-none';
  if (t === 'yes') plan = 'cognitiveperformance-protocol';
  return { plan, t };
}
function HRVMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hrvmonitoring-none';
  if (t === 'yes') plan = 'hrvmonitoring-protocol';
  return { plan, t };
}
function SleepForPerformance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleepforperformance-none';
  if (t === 'yes') plan = 'sleepforperformance-protocol';
  return { plan, t };
}
function MentalSkills(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mentalskills-none';
  if (t === 'yes') plan = 'mentalskills-protocol';
  return { plan, t };
}
function EquipmentOptimization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'equipmentoptimization-none';
  if (t === 'yes') plan = 'equipmentoptimization-protocol';
  return { plan, t };
}
function PeriodizationPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'periodizationplan-none';
  if (t === 'yes') plan = 'periodizationplan-protocol';
  return { plan, t };
}
function Overtraining(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'overtraining-none';
  if (t === 'yes') plan = 'overtraining-protocol';
  return { plan, t };
}
module.exports = {
  VO2Max, LactateThreshold, MovementScreen, CognitivePerformance, HRVMonitoring, SleepForPerformance, MentalSkills, EquipmentOptimization, PeriodizationPlan, Overtraining
};
