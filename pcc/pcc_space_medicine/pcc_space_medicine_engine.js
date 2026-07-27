// P3-DC pcc_space_medicine_engine v3.67.0
'use strict';
function MicrogravityPhysiology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microgravityphysiology-none';
  if (t === 'yes') plan = 'microgravityphysiology-protocol';
  return { plan, t };
}
function RadiationProtection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiationprotection-none';
  if (t === 'yes') plan = 'radiationprotection-protocol';
  return { plan, t };
}
function IsolationPsychology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'isolationpsychology-none';
  if (t === 'yes') plan = 'isolationpsychology-protocol';
  return { plan, t };
}
function EVAMedical(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'evamedical-none';
  if (t === 'yes') plan = 'evamedical-protocol';
  return { plan, t };
}
function Countermeasures(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'countermeasures-none';
  if (t === 'yes') plan = 'countermeasures-protocol';
  return { plan, t };
}
function SpaceNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spacenutrition-none';
  if (t === 'yes') plan = 'spacenutrition-protocol';
  return { plan, t };
}
function TelemedicineSpace(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'telemedicinespace-none';
  if (t === 'yes') plan = 'telemedicinespace-protocol';
  return { plan, t };
}
function ReentryCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'reentrycare-none';
  if (t === 'yes') plan = 'reentrycare-protocol';
  return { plan, t };
}
function AstronautSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'astronautselection-none';
  if (t === 'yes') plan = 'astronautselection-protocol';
  return { plan, t };
}
function LongDurationHealth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'longdurationhealth-none';
  if (t === 'yes') plan = 'longdurationhealth-protocol';
  return { plan, t };
}
module.exports = {
  MicrogravityPhysiology, RadiationProtection, IsolationPsychology, EVAMedical, Countermeasures, SpaceNutrition, TelemedicineSpace, ReentryCare, AstronautSelection, LongDurationHealth
};
