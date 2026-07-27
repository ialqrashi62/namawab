// P3-CZ pcc_geriatric_surgery_engine v3.64.0
'use strict';
function FrailtyIndex(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'frailtyindex-none';
  if (t === 'yes') plan = 'frailtyindex-protocol';
  return { plan, t };
}
function Prehabilitation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prehabilitation-none';
  if (t === 'yes') plan = 'prehabilitation-protocol';
  return { plan, t };
}
function DeliriumRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'deliriumrisk-none';
  if (t === 'yes') plan = 'deliriumrisk-protocol';
  return { plan, t };
}
function NutritionScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutritionscreen-none';
  if (t === 'yes') plan = 'nutritionscreen-protocol';
  return { plan, t };
}
function Polypharmacy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polypharmacy-none';
  if (t === 'yes') plan = 'polypharmacy-protocol';
  return { plan, t };
}
function MobilityPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mobilityplan-none';
  if (t === 'yes') plan = 'mobilityplan-protocol';
  return { plan, t };
}
function DischargeDestination(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dischargedestination-none';
  if (t === 'yes') plan = 'dischargedestination-protocol';
  return { plan, t };
}
function ComplicationRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'complicationrisk-none';
  if (t === 'yes') plan = 'complicationrisk-protocol';
  return { plan, t };
}
function PalliativeTalk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'palliativetalk-none';
  if (t === 'yes') plan = 'palliativetalk-protocol';
  return { plan, t };
}
function FollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'followup-none';
  if (t === 'yes') plan = 'followup-protocol';
  return { plan, t };
}
module.exports = {
  FrailtyIndex, Prehabilitation, DeliriumRisk, NutritionScreen, Polypharmacy, MobilityPlan, DischargeDestination, ComplicationRisk, PalliativeTalk, FollowUp
};
