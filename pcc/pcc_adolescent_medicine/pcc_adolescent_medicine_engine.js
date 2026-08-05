// P3_EE pcc_adolescent_medicine_engine v3.95.0
'use strict';
function EatingDisorderAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eatingDisorderAssessment-none';
  if (t === 'yes') plan = 'eatingDisorderAssessment-protocol';
  return { plan, t };
}
function AdolescentDepressionScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentDepressionScreen-none';
  if (t === 'yes') plan = 'adolescentDepressionScreen-protocol';
  return { plan, t };
}
function PubertyDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pubertyDisorders-none';
  if (t === 'yes') plan = 'pubertyDisorders-protocol';
  return { plan, t };
}
function AdolescentSubstanceUse(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentSubstanceUse-none';
  if (t === 'yes') plan = 'adolescentSubstanceUse-protocol';
  return { plan, t };
}
function AdolescentSexualHealth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentSexualHealth-none';
  if (t === 'yes') plan = 'adolescentSexualHealth-protocol';
  return { plan, t };
}
function AdolescentImmunizations(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentImmunizations-none';
  if (t === 'yes') plan = 'adolescentImmunizations-protocol';
  return { plan, t };
}
function AdolescentObesity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentObesity-none';
  if (t === 'yes') plan = 'adolescentObesity-protocol';
  return { plan, t };
}
function AdolescentRiskBehavior(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentRiskBehavior-none';
  if (t === 'yes') plan = 'adolescentRiskBehavior-protocol';
  return { plan, t };
}
function TransitionToAdultCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transitionToAdultCare-none';
  if (t === 'yes') plan = 'transitionToAdultCare-protocol';
  return { plan, t };
}
function AdolescentGynecology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adolescentGynecology-none';
  if (t === 'yes') plan = 'adolescentGynecology-protocol';
  return { plan, t };
}
module.exports = { EatingDisorderAssessment, AdolescentDepressionScreen, PubertyDisorders, AdolescentSubstanceUse, AdolescentSexualHealth, AdolescentImmunizations, AdolescentObesity, AdolescentRiskBehavior, TransitionToAdultCare, AdolescentGynecology };
