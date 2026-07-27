// P3-DE pcc_metabolic_health_engine v3.69.0
'use strict';
function InsulinResistance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'insulinresistance-none';
  if (t === 'yes') plan = 'insulinresistance-protocol';
  return { plan, t };
}
function GlucoseVariability(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'glucosevariability-none';
  if (t === 'yes') plan = 'glucosevariability-protocol';
  return { plan, t };
}
function MetabolicSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolicsyndrome-none';
  if (t === 'yes') plan = 'metabolicsyndrome-protocol';
  return { plan, t };
}
function LipidProfile(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lipidprofile-none';
  if (t === 'yes') plan = 'lipidprofile-protocol';
  return { plan, t };
}
function FattyLiver(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fattyliver-none';
  if (t === 'yes') plan = 'fattyliver-protocol';
  return { plan, t };
}
function KetogenicTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ketogenictherapy-none';
  if (t === 'yes') plan = 'ketogenictherapy-protocol';
  return { plan, t };
}
function TimeRestrictedEating(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'timerestrictedeating-none';
  if (t === 'yes') plan = 'timerestrictedeating-protocol';
  return { plan, t };
}
function ContinuousGlucose(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'continuousglucose-none';
  if (t === 'yes') plan = 'continuousglucose-protocol';
  return { plan, t };
}
function ThyroidMetabolism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thyroidmetabolism-none';
  if (t === 'yes') plan = 'thyroidmetabolism-protocol';
  return { plan, t };
}
function WeightSetPoint(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'weightsetpoint-none';
  if (t === 'yes') plan = 'weightsetpoint-protocol';
  return { plan, t };
}
module.exports = {
  InsulinResistance, GlucoseVariability, MetabolicSyndrome, LipidProfile, FattyLiver, KetogenicTherapy, TimeRestrictedEating, ContinuousGlucose, ThyroidMetabolism, WeightSetPoint
};
