// P3_CZ pcc_rehab_medicine_engine v3.64.0
'use strict';
function FunctionalStatus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'functionalstatus-none';
  if (t === 'yes') plan = 'functionalstatus-protocol';
  return { plan, t };
}
function Impairment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'impairment-none';
  if (t === 'yes') plan = 'impairment-protocol';
  return { plan, t };
}
function GoalSetting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'goalsetting-none';
  if (t === 'yes') plan = 'goalsetting-protocol';
  return { plan, t };
}
function TherapyPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'therapyplan-none';
  if (t === 'yes') plan = 'therapyplan-protocol';
  return { plan, t };
}
function OutcomeMeasure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'outcomemeasure-none';
  if (t === 'yes') plan = 'outcomemeasure-protocol';
  return { plan, t };
}
function DischargePlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dischargeplan-none';
  if (t === 'yes') plan = 'dischargeplan-protocol';
  return { plan, t };
}
function Equipment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'equipment-none';
  if (t === 'yes') plan = 'equipment-protocol';
  return { plan, t };
}
function Caregiver(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'caregiver-none';
  if (t === 'yes') plan = 'caregiver-protocol';
  return { plan, t };
}
function CommunityReintegration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'communityreintegration-none';
  if (t === 'yes') plan = 'communityreintegration-protocol';
  return { plan, t };
}
function QualityOfLife(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'qualityoflife-none';
  if (t === 'yes') plan = 'qualityoflife-protocol';
  return { plan, t };
}
module.exports = {
  FunctionalStatus, Impairment, GoalSetting, TherapyPlan, OutcomeMeasure, DischargePlan, Equipment, Caregiver, CommunityReintegration, QualityOfLife
};
