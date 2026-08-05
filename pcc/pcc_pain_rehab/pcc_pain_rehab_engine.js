// P3_CZ pcc_pain_rehab_engine v3.64.0
'use strict';
function PainAdmission(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'painadmission-none';
  if (t === 'yes') plan = 'painadmission-protocol';
  return { plan, t };
}
function Multidisciplinary(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'multidisciplinary-none';
  if (t === 'yes') plan = 'multidisciplinary-protocol';
  return { plan, t };
}
function PhysicalTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'physicaltherapy-none';
  if (t === 'yes') plan = 'physicaltherapy-protocol';
  return { plan, t };
}
function OccupationalTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'occupationaltherapy-none';
  if (t === 'yes') plan = 'occupationaltherapy-protocol';
  return { plan, t };
}
function Psychology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'psychology-none';
  if (t === 'yes') plan = 'psychology-protocol';
  return { plan, t };
}
function Interventional(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'interventional-none';
  if (t === 'yes') plan = 'interventional-protocol';
  return { plan, t };
}
function MedicationTaper(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'medicationtaper-none';
  if (t === 'yes') plan = 'medicationtaper-protocol';
  return { plan, t };
}
function FunctionalRestoration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'functionalrestoration-none';
  if (t === 'yes') plan = 'functionalrestoration-protocol';
  return { plan, t };
}
function Discharge(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'discharge-none';
  if (t === 'yes') plan = 'discharge-protocol';
  return { plan, t };
}
function RelapsePrevention(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'relapseprevention-none';
  if (t === 'yes') plan = 'relapseprevention-protocol';
  return { plan, t };
}
module.exports = {
  PainAdmission, Multidisciplinary, PhysicalTherapy, OccupationalTherapy, Psychology, Interventional, MedicationTaper, FunctionalRestoration, Discharge, RelapsePrevention
};
