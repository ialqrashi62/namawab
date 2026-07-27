// P3-EG pcc_pediatric_pulm_engine v3.97.0
'use strict';
function PediatricAsthmaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAsthmaManagement-none';
  if (t === 'yes') plan = 'pediatricAsthmaManagement-protocol';
  return { plan, t };
}
function PediatricCysticFibrosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCysticFibrosis-none';
  if (t === 'yes') plan = 'pediatricCysticFibrosis-protocol';
  return { plan, t };
}
function BronchiolitisManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bronchiolitisManagement-none';
  if (t === 'yes') plan = 'bronchiolitisManagement-protocol';
  return { plan, t };
}
function PediatricPneumonia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPneumonia-none';
  if (t === 'yes') plan = 'pediatricPneumonia-protocol';
  return { plan, t };
}
function PediatricTuberculosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTuberculosis-none';
  if (t === 'yes') plan = 'pediatricTuberculosis-protocol';
  return { plan, t };
}
function PediatricSleepApnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSleepApnea-none';
  if (t === 'yes') plan = 'pediatricSleepApnea-protocol';
  return { plan, t };
}
function PediatricChronicLungDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricChronicLungDisease-none';
  if (t === 'yes') plan = 'pediatricChronicLungDisease-protocol';
  return { plan, t };
}
function PediatricVentilationSupport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVentilationSupport-none';
  if (t === 'yes') plan = 'pediatricVentilationSupport-protocol';
  return { plan, t };
}
function PediatricAirwayAnomalies(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAirwayAnomalies-none';
  if (t === 'yes') plan = 'pediatricAirwayAnomalies-protocol';
  return { plan, t };
}
function PediatricPulmonaryHypertension(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPulmonaryHypertension-none';
  if (t === 'yes') plan = 'pediatricPulmonaryHypertension-protocol';
  return { plan, t };
}
module.exports = { PediatricAsthmaManagement, PediatricCysticFibrosis, BronchiolitisManagement, PediatricPneumonia, PediatricTuberculosis, PediatricSleepApnea, PediatricChronicLungDisease, PediatricVentilationSupport, PediatricAirwayAnomalies, PediatricPulmonaryHypertension };
