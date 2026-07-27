// P3-DM pcc_antimicrobial_stewardship_engine v3.77.0
'use strict';
function EmpiricAntibioticChoice(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'empiricantibioticchoice-none';
  if (t === 'yes') plan = 'empiricantibioticchoice-protocol';
  return { plan, t };
}
function DeEscalationReview(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'deescalationreview-none';
  if (t === 'yes') plan = 'deescalationreview-protocol';
  return { plan, t };
}
function TherapeuticDrugMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'therapeuticdrugmonitoring-none';
  if (t === 'yes') plan = 'therapeuticdrugmonitoring-protocol';
  return { plan, t };
}
function AllergyCrossReactivity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergycrossreactivity-none';
  if (t === 'yes') plan = 'allergycrossreactivity-protocol';
  return { plan, t };
}
function RenalDoseAdjustment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'renaldoseadjustment-none';
  if (t === 'yes') plan = 'renaldoseadjustment-protocol';
  return { plan, t };
}
function HepaticDoseAdjustment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hepaticdoseadjustment-none';
  if (t === 'yes') plan = 'hepaticdoseadjustment-protocol';
  return { plan, t };
}
function DrugInteractionCheck(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'druginteractioncheck-none';
  if (t === 'yes') plan = 'druginteractioncheck-protocol';
  return { plan, t };
}
function CultureFollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'culturefollowup-none';
  if (t === 'yes') plan = 'culturefollowup-protocol';
  return { plan, t };
}
function AntibioticSpectrum(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'antibioticspectrum-none';
  if (t === 'yes') plan = 'antibioticspectrum-protocol';
  return { plan, t };
}
function StewardshipMetrics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'stewardshipmetrics-none';
  if (t === 'yes') plan = 'stewardshipmetrics-protocol';
  return { plan, t };
}
module.exports = {
  EmpiricAntibioticChoice, DeEscalationReview, TherapeuticDrugMonitoring, AllergyCrossReactivity, RenalDoseAdjustment, HepaticDoseAdjustment, DrugInteractionCheck, CultureFollowUp, AntibioticSpectrum, StewardshipMetrics
};
