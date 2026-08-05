// P3_DB pcc_metabolic_surgery_engine v3.66.0
'use strict';
function BariatricRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bariatricrisk-none';
  if (t === 'yes') plan = 'bariatricrisk-protocol';
  return { plan, t };
}
function ProcedureSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'procedureselection-none';
  if (t === 'yes') plan = 'procedureselection-protocol';
  return { plan, t };
}
function NutritionalDeficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionaldeficiency-none';
  if (t === 'yes') plan = 'nutritionaldeficiency-protocol';
  return { plan, t };
}
function DumpingSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dumpingsyndrome-none';
  if (t === 'yes') plan = 'dumpingsyndrome-protocol';
  return { plan, t };
}
function WeightRecurrence(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'weightrecurrence-none';
  if (t === 'yes') plan = 'weightrecurrence-protocol';
  return { plan, t };
}
function DiabetesRemission(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diabetesremission-none';
  if (t === 'yes') plan = 'diabetesremission-protocol';
  return { plan, t };
}
function MetabolicMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolicmonitoring-none';
  if (t === 'yes') plan = 'metabolicmonitoring-protocol';
  return { plan, t };
}
function PreopOptimization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'preopoptimization-none';
  if (t === 'yes') plan = 'preopoptimization-protocol';
  return { plan, t };
}
function PostopDiet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postopdiet-none';
  if (t === 'yes') plan = 'postopdiet-protocol';
  return { plan, t };
}
function LongTermFollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'longtermfollowup-none';
  if (t === 'yes') plan = 'longtermfollowup-protocol';
  return { plan, t };
}
module.exports = {
  BariatricRisk, ProcedureSelection, NutritionalDeficiency, DumpingSyndrome, WeightRecurrence, DiabetesRemission, MetabolicMonitoring, PreopOptimization, PostopDiet, LongTermFollowUp
};
