// P3-CY pcc_travel_med_engine v3.63.0
'use strict';
function DestinationRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'destinationrisk-none';
  if (t === 'yes') plan = 'destinationrisk-protocol';
  return { plan, t };
}
function VaccinationNeed(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vaccinationneed-none';
  if (t === 'yes') plan = 'vaccinationneed-protocol';
  return { plan, t };
}
function MalariaProphylaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'malariaprophylaxis-none';
  if (t === 'yes') plan = 'malariaprophylaxis-protocol';
  return { plan, t };
}
function TravelersDiarrhea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'travelersdiarrhea-none';
  if (t === 'yes') plan = 'travelersdiarrhea-protocol';
  return { plan, t };
}
function JetLag(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'jetlag-none';
  if (t === 'yes') plan = 'jetlag-protocol';
  return { plan, t };
}
function DvtRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dvtrisk-none';
  if (t === 'yes') plan = 'dvtrisk-protocol';
  return { plan, t };
}
function Altitude(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'altitude-none';
  if (t === 'yes') plan = 'altitude-protocol';
  return { plan, t };
}
function DivingFitness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'divingfitness-none';
  if (t === 'yes') plan = 'divingfitness-protocol';
  return { plan, t };
}
function PregnancyTravel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pregnancytravel-none';
  if (t === 'yes') plan = 'pregnancytravel-protocol';
  return { plan, t };
}
function ReturnEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'returnevaluation-none';
  if (t === 'yes') plan = 'returnevaluation-protocol';
  return { plan, t };
}
module.exports = {
  DestinationRisk, VaccinationNeed, MalariaProphylaxis, TravelersDiarrhea, JetLag, DvtRisk, Altitude, DivingFitness, PregnancyTravel, ReturnEvaluation
};
