// P3-DX pcc_vascular_intervention_engine v3.88.0
'use strict';
function CarotidStentPlacement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'carotidStentPlacement-none';
  if (t === 'yes') plan = 'carotidStentPlacement-protocol';
  return { plan, t };
}
function AAAEndovascularRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aAAEndovascularRepair-none';
  if (t === 'yes') plan = 'aAAEndovascularRepair-protocol';
  return { plan, t };
}
function PeripheralAngioplasty(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'peripheralAngioplasty-none';
  if (t === 'yes') plan = 'peripheralAngioplasty-protocol';
  return { plan, t };
}
function DVTThrombolysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dVTThrombolysis-none';
  if (t === 'yes') plan = 'dVTThrombolysis-protocol';
  return { plan, t };
}
function VaricoseVeinAblation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'varicoseVeinAblation-none';
  if (t === 'yes') plan = 'varicoseVeinAblation-protocol';
  return { plan, t };
}
function AVMEmbolization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aVMEmbolization-none';
  if (t === 'yes') plan = 'aVMEmbolization-protocol';
  return { plan, t };
}
function RenalArteryStenting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'renalArteryStenting-none';
  if (t === 'yes') plan = 'renalArteryStenting-protocol';
  return { plan, t };
}
function MesentericIschemiaIntervention(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mesentericIschemiaIntervention-none';
  if (t === 'yes') plan = 'mesentericIschemiaIntervention-protocol';
  return { plan, t };
}
function ClaudicationRevascularization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'claudicationRevascularization-none';
  if (t === 'yes') plan = 'claudicationRevascularization-protocol';
  return { plan, t };
}
function VascularTraumaControl(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularTraumaControl-none';
  if (t === 'yes') plan = 'vascularTraumaControl-protocol';
  return { plan, t };
}
module.exports = { CarotidStentPlacement, AAAEndovascularRepair, PeripheralAngioplasty, DVTThrombolysis, VaricoseVeinAblation, AVMEmbolization, RenalArteryStenting, MesentericIschemiaIntervention, ClaudicationRevascularization, VascularTraumaControl };
