// P3_CX pcc_weight_mgmt_engine v3.62.0
'use strict';
function Bmi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bmi-none';
  if (t === 'yes') plan = 'bmi-protocol';
  return { plan, t };
}
function ObesityClass(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'obesityclass-none';
  if (t === 'yes') plan = 'obesityclass-protocol';
  return { plan, t };
}
function BariatricReferral(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bariatricreferral-none';
  if (t === 'yes') plan = 'bariatricreferral-protocol';
  return { plan, t };
}
function DietPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dietplan-none';
  if (t === 'yes') plan = 'dietplan-protocol';
  return { plan, t };
}
function Exercise(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'exercise-none';
  if (t === 'yes') plan = 'exercise-protocol';
  return { plan, t };
}
function Comorbidity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'comorbidity-none';
  if (t === 'yes') plan = 'comorbidity-protocol';
  return { plan, t };
}
function Medication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'medication-none';
  if (t === 'yes') plan = 'medication-protocol';
  return { plan, t };
}
function FollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'followup-none';
  if (t === 'yes') plan = 'followup-protocol';
  return { plan, t };
}
function Goal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'goal-none';
  if (t === 'yes') plan = 'goal-protocol';
  return { plan, t };
}
function SurgeryRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'surgeryrisk-none';
  if (t === 'yes') plan = 'surgeryrisk-protocol';
  return { plan, t };
}
module.exports = {
  Bmi, ObesityClass, BariatricReferral, DietPlan, Exercise, Comorbidity, Medication, FollowUp, Goal, SurgeryRisk
};
