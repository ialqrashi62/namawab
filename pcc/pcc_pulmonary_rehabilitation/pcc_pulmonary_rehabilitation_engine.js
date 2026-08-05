// P3_DK pcc_pulmonary_rehabilitation_engine v3.75.0
'use strict';
function ExerciseCapacity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'exercisecapacity-none';
  if (t === 'yes') plan = 'exercisecapacity-protocol';
  return { plan, t };
}
function DyspneaIndex(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dyspneaindex-none';
  if (t === 'yes') plan = 'dyspneaindex-protocol';
  return { plan, t };
}
function SixMinuteWalk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sixminutewalk-none';
  if (t === 'yes') plan = 'sixminutewalk-protocol';
  return { plan, t };
}
function RehabAdherence(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rehabadherence-none';
  if (t === 'yes') plan = 'rehabadherence-protocol';
  return { plan, t };
}
function InhalerTechnique(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'inhalertechnique-none';
  if (t === 'yes') plan = 'inhalertechnique-protocol';
  return { plan, t };
}
function AirwayClearance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'airwayclearance-none';
  if (t === 'yes') plan = 'airwayclearance-protocol';
  return { plan, t };
}
function PulmonaryEducation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pulmonaryeducation-none';
  if (t === 'yes') plan = 'pulmonaryeducation-protocol';
  return { plan, t };
}
function SmokingCessation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'smokingcessation-none';
  if (t === 'yes') plan = 'smokingcessation-protocol';
  return { plan, t };
}
function NutritionPulmonary(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionpulmonary-none';
  if (t === 'yes') plan = 'nutritionpulmonary-protocol';
  return { plan, t };
}
function PsychosocialScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'psychosocialscreen-none';
  if (t === 'yes') plan = 'psychosocialscreen-protocol';
  return { plan, t };
}
module.exports = {
  ExerciseCapacity, DyspneaIndex, SixMinuteWalk, RehabAdherence, InhalerTechnique, AirwayClearance, PulmonaryEducation, SmokingCessation, NutritionPulmonary, PsychosocialScreen
};
