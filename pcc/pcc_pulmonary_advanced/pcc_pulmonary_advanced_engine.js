// P3_DJ pcc_pulmonary_advanced_engine v3.74.0
'use strict';
function SpirometryPattern(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spirometrypattern-none';
  if (t === 'yes') plan = 'spirometrypattern-protocol';
  return { plan, t };
}
function DiffusionCapacity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diffusioncapacity-none';
  if (t === 'yes') plan = 'diffusioncapacity-protocol';
  return { plan, t };
}
function Bronchoprovocation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bronchoprovocation-none';
  if (t === 'yes') plan = 'bronchoprovocation-protocol';
  return { plan, t };
}
function EosinophilicAsthma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eosinophilicasthma-none';
  if (t === 'yes') plan = 'eosinophilicasthma-protocol';
  return { plan, t };
}
function COPDExacerbation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'copdexacerbation-none';
  if (t === 'yes') plan = 'copdexacerbation-protocol';
  return { plan, t };
}
function InterstitialLung(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'interstitiallung-none';
  if (t === 'yes') plan = 'interstitiallung-protocol';
  return { plan, t };
}
function PulmonaryRehab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pulmonaryrehab-none';
  if (t === 'yes') plan = 'pulmonaryrehab-protocol';
  return { plan, t };
}
function OxygenTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oxygentherapy-none';
  if (t === 'yes') plan = 'oxygentherapy-protocol';
  return { plan, t };
}
function VentilatorySupport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ventilatorysupport-none';
  if (t === 'yes') plan = 'ventilatorysupport-protocol';
  return { plan, t };
}
function LungTransplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lungtransplant-none';
  if (t === 'yes') plan = 'lungtransplant-protocol';
  return { plan, t };
}
module.exports = {
  SpirometryPattern, DiffusionCapacity, Bronchoprovocation, EosinophilicAsthma, COPDExacerbation, InterstitialLung, PulmonaryRehab, OxygenTherapy, VentilatorySupport, LungTransplant
};
