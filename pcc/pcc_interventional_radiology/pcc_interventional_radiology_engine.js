// P3-EA pcc_interventional_radiology_engine v3.91.0
'use strict';
function TIPSProcedure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tIPSProcedure-none';
  if (t === 'yes') plan = 'tIPSProcedure-protocol';
  return { plan, t };
}
function ChemoembolizationHCC(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chemoembolizationHCC-none';
  if (t === 'yes') plan = 'chemoembolizationHCC-protocol';
  return { plan, t };
}
function UterineFibroidEmbolization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'uterineFibroidEmbolization-none';
  if (t === 'yes') plan = 'uterineFibroidEmbolization-protocol';
  return { plan, t };
}
function VertebroplastyKyphoplasty(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vertebroplastyKyphoplasty-none';
  if (t === 'yes') plan = 'vertebroplastyKyphoplasty-protocol';
  return { plan, t };
}
function BiliaryDrainagePTBD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biliaryDrainagePTBD-none';
  if (t === 'yes') plan = 'biliaryDrainagePTBD-protocol';
  return { plan, t };
}
function GastrostomyTubePlacement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gastrostomyTubePlacement-none';
  if (t === 'yes') plan = 'gastrostomyTubePlacement-protocol';
  return { plan, t };
}
function ThrombolysisDVT(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thrombolysisDVT-none';
  if (t === 'yes') plan = 'thrombolysisDVT-protocol';
  return { plan, t };
}
function AorticStentGraft(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aorticStentGraft-none';
  if (t === 'yes') plan = 'aorticStentGraft-protocol';
  return { plan, t };
}
function CryoablationTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cryoablationTumor-none';
  if (t === 'yes') plan = 'cryoablationTumor-protocol';
  return { plan, t };
}
function RadiofrequencyAblationLiver(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiofrequencyAblationLiver-none';
  if (t === 'yes') plan = 'radiofrequencyAblationLiver-protocol';
  return { plan, t };
}
module.exports = { TIPSProcedure, ChemoembolizationHCC, UterineFibroidEmbolization, VertebroplastyKyphoplasty, BiliaryDrainagePTBD, GastrostomyTubePlacement, ThrombolysisDVT, AorticStentGraft, CryoablationTumor, RadiofrequencyAblationLiver };
