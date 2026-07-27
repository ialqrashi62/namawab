// P3-DV pcc_derma_cosmetic_surgery_engine v3.86.0
'use strict';
function RhytidectomyAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rhytidectomyAssessment-none';
  if (t === 'yes') plan = 'rhytidectomyAssessment-protocol';
  return { plan, t };
}
function BlepharoplastyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'blepharoplastyIndication-none';
  if (t === 'yes') plan = 'blepharoplastyIndication-protocol';
  return { plan, t };
}
function RhinoplastyConsult(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rhinoplastyConsult-none';
  if (t === 'yes') plan = 'rhinoplastyConsult-protocol';
  return { plan, t };
}
function LiposuctionSafety(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'liposuctionSafety-none';
  if (t === 'yes') plan = 'liposuctionSafety-protocol';
  return { plan, t };
}
function BotulinumToxinProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'botulinumToxinProtocol-none';
  if (t === 'yes') plan = 'botulinumToxinProtocol-protocol';
  return { plan, t };
}
function DermalFillerPlacement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dermalFillerPlacement-none';
  if (t === 'yes') plan = 'dermalFillerPlacement-protocol';
  return { plan, t };
}
function ChemicalPeelSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chemicalPeelSelection-none';
  if (t === 'yes') plan = 'chemicalPeelSelection-protocol';
  return { plan, t };
}
function LaserResurfacingType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laserResurfacingType-none';
  if (t === 'yes') plan = 'laserResurfacingType-protocol';
  return { plan, t };
}
function HairTransplantPlanning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hairTransplantPlanning-none';
  if (t === 'yes') plan = 'hairTransplantPlanning-protocol';
  return { plan, t };
}
function CosmeticScreeningPsych(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cosmeticScreeningPsych-none';
  if (t === 'yes') plan = 'cosmeticScreeningPsych-protocol';
  return { plan, t };
}
module.exports = { RhytidectomyAssessment, BlepharoplastyIndication, RhinoplastyConsult, LiposuctionSafety, BotulinumToxinProtocol, DermalFillerPlacement, ChemicalPeelSelection, LaserResurfacingType, HairTransplantPlanning, CosmeticScreeningPsych };
