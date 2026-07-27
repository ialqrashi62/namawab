// P3-EB pcc_plastic_surgery_ext_engine v3.92.0
'use strict';
function BreastReconstructionSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'breastReconstructionSelection-none';
  if (t === 'yes') plan = 'breastReconstructionSelection-protocol';
  return { plan, t };
}
function BurnReconstructionTiming(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'burnReconstructionTiming-none';
  if (t === 'yes') plan = 'burnReconstructionTiming-protocol';
  return { plan, t };
}
function CleftLipRepairTiming(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cleftLipRepairTiming-none';
  if (t === 'yes') plan = 'cleftLipRepairTiming-protocol';
  return { plan, t };
}
function CleftPalateRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cleftPalateRepair-none';
  if (t === 'yes') plan = 'cleftPalateRepair-protocol';
  return { plan, t };
}
function CraniosynostosisSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'craniosynostosisSurgery-none';
  if (t === 'yes') plan = 'craniosynostosisSurgery-protocol';
  return { plan, t };
}
function HandReplantationDecision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'handReplantationDecision-none';
  if (t === 'yes') plan = 'handReplantationDecision-protocol';
  return { plan, t };
}
function MicrosurgeryFreeFlap(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microsurgeryFreeFlap-none';
  if (t === 'yes') plan = 'microsurgeryFreeFlap-protocol';
  return { plan, t };
}
function ScarRevisionIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'scarRevisionIndication-none';
  if (t === 'yes') plan = 'scarRevisionIndication-protocol';
  return { plan, t };
}
function SkinCancerReconstruction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'skinCancerReconstruction-none';
  if (t === 'yes') plan = 'skinCancerReconstruction-protocol';
  return { plan, t };
}
function GenderAffirmingSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'genderAffirmingSurgery-none';
  if (t === 'yes') plan = 'genderAffirmingSurgery-protocol';
  return { plan, t };
}
module.exports = { BreastReconstructionSelection, BurnReconstructionTiming, CleftLipRepairTiming, CleftPalateRepair, CraniosynostosisSurgery, HandReplantationDecision, MicrosurgeryFreeFlap, ScarRevisionIndication, SkinCancerReconstruction, GenderAffirmingSurgery };
