// P3-DR pcc_obstetrics_advanced_engine v3.82.0
'use strict';
function PreeclampsiaSevere(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'preeclampsiasevere-none';
  if (t === 'yes') plan = 'preeclampsiasevere-protocol';
  return { plan, t };
}
function EclampsiaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eclampsiamanagement-none';
  if (t === 'yes') plan = 'eclampsiamanagement-protocol';
  return { plan, t };
}
function HELLPSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hellpsyndrome-none';
  if (t === 'yes') plan = 'hellpsyndrome-protocol';
  return { plan, t };
}
function PlacentalAbruption(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'placentalabruption-none';
  if (t === 'yes') plan = 'placentalabruption-protocol';
  return { plan, t };
}
function PlacentaPreviaAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'placentapreviaadvanced-none';
  if (t === 'yes') plan = 'placentapreviaadvanced-protocol';
  return { plan, t };
}
function PostpartumHemorrhage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postpartumhemorrhage-none';
  if (t === 'yes') plan = 'postpartumhemorrhage-protocol';
  return { plan, t };
}
function AmnioticFluidEmbolism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'amnioticfluidembolism-none';
  if (t === 'yes') plan = 'amnioticfluidembolism-protocol';
  return { plan, t };
}
function UterineRupture(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'uterinerupture-none';
  if (t === 'yes') plan = 'uterinerupture-protocol';
  return { plan, t };
}
function ObstetricSepsis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'obstetricsepsis-none';
  if (t === 'yes') plan = 'obstetricsepsis-protocol';
  return { plan, t };
}
function PeripartumCardiomyopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'peripartumcardiomyopathy-none';
  if (t === 'yes') plan = 'peripartumcardiomyopathy-protocol';
  return { plan, t };
}
module.exports = {
  PreeclampsiaSevere, EclampsiaManagement, HELLPSyndrome, PlacentalAbruption, PlacentaPreviaAdvanced, PostpartumHemorrhage, AmnioticFluidEmbolism, UterineRupture, ObstetricSepsis, PeripartumCardiomyopathy
};
