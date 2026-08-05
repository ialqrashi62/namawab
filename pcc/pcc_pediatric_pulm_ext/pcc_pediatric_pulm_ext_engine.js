// P3_EQ pcc_pediatric_pulm_ext_engine v3.107.0
'use strict';
function PediatricBronchopulmonaryDysplasia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBronchopulmonaryDysplasia-none';
  if (t === 'yes') plan = 'pediatricBronchopulmonaryDysplasia-protocol';
  return { plan, t };
}
function PediatricPulmonaryHypertensionExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPulmonaryHypertensionExt-none';
  if (t === 'yes') plan = 'pediatricPulmonaryHypertensionExt-protocol';
  return { plan, t };
}
function PediatricInterstitialLungDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricInterstitialLungDisease-none';
  if (t === 'yes') plan = 'pediatricInterstitialLungDisease-protocol';
  return { plan, t };
}
function PediatricBronchiectasis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBronchiectasis-none';
  if (t === 'yes') plan = 'pediatricBronchiectasis-protocol';
  return { plan, t };
}
function PediatricPlasticBronchitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPlasticBronchitis-none';
  if (t === 'yes') plan = 'pediatricPlasticBronchitis-protocol';
  return { plan, t };
}
function PediatricPulmonaryAlveolarProteinosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPulmonaryAlveolarProteinosis-none';
  if (t === 'yes') plan = 'pediatricPulmonaryAlveolarProteinosis-protocol';
  return { plan, t };
}
function PediatricSurfactantDysfunction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSurfactantDysfunction-none';
  if (t === 'yes') plan = 'pediatricSurfactantDysfunction-protocol';
  return { plan, t };
}
function PediatricPulmonaryHemosiderosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPulmonaryHemosiderosis-none';
  if (t === 'yes') plan = 'pediatricPulmonaryHemosiderosis-protocol';
  return { plan, t };
}
function PediatricChILD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricChILD-none';
  if (t === 'yes') plan = 'pediatricChILD-protocol';
  return { plan, t };
}
function PediatricLungTransplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLungTransplant-none';
  if (t === 'yes') plan = 'pediatricLungTransplant-protocol';
  return { plan, t };
}
module.exports = { PediatricBronchopulmonaryDysplasia, PediatricPulmonaryHypertensionExt, PediatricInterstitialLungDisease, PediatricBronchiectasis, PediatricPlasticBronchitis, PediatricPulmonaryAlveolarProteinosis, PediatricSurfactantDysfunction, PediatricPulmonaryHemosiderosis, PediatricChILD, PediatricLungTransplant };
