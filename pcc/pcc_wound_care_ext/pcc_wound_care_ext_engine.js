// P3-CY pcc_wound_care_ext_engine v3.63.0
'use strict';
function WoundAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'woundassessment-none';
  if (t === 'yes') plan = 'woundassessment-protocol';
  return { plan, t };
}
function Debridement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'debridement-none';
  if (t === 'yes') plan = 'debridement-protocol';
  return { plan, t };
}
function InfectionControl(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'infectioncontrol-none';
  if (t === 'yes') plan = 'infectioncontrol-protocol';
  return { plan, t };
}
function Dressing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dressing-none';
  if (t === 'yes') plan = 'dressing-protocol';
  return { plan, t };
}
function PressureInjury(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pressureinjury-none';
  if (t === 'yes') plan = 'pressureinjury-protocol';
  return { plan, t };
}
function DiabeticFoot(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diabeticfoot-none';
  if (t === 'yes') plan = 'diabeticfoot-protocol';
  return { plan, t };
}
function VacTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vactherapy-none';
  if (t === 'yes') plan = 'vactherapy-protocol';
  return { plan, t };
}
function HealingScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'healingscore-none';
  if (t === 'yes') plan = 'healingscore-protocol';
  return { plan, t };
}
function NutritionWound(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionwound-none';
  if (t === 'yes') plan = 'nutritionwound-protocol';
  return { plan, t };
}
function ScarManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'scarmanagement-none';
  if (t === 'yes') plan = 'scarmanagement-protocol';
  return { plan, t };
}
module.exports = {
  WoundAssessment, Debridement, InfectionControl, Dressing, PressureInjury, DiabeticFoot, VacTherapy, HealingScore, NutritionWound, ScarManagement
};
