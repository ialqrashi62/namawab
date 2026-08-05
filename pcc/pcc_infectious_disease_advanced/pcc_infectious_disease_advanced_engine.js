// P3_DM pcc_infectious_disease_advanced_engine v3.77.0
'use strict';
function FeverOfUnknownOrigin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'feverofunknownorigin-none';
  if (t === 'yes') plan = 'feverofunknownorigin-protocol';
  return { plan, t };
}
function TravelRelatedInfection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'travelrelatedinfection-none';
  if (t === 'yes') plan = 'travelrelatedinfection-protocol';
  return { plan, t };
}
function ImmunocompromisedHost(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunocompromisedhost-none';
  if (t === 'yes') plan = 'immunocompromisedhost-protocol';
  return { plan, t };
}
function HealthcareAssociatedInfection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'healthcareassociatedinfection-none';
  if (t === 'yes') plan = 'healthcareassociatedinfection-protocol';
  return { plan, t };
}
function ZoonoticDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'zoonoticdisease-none';
  if (t === 'yes') plan = 'zoonoticdisease-protocol';
  return { plan, t };
}
function VectorBorneDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vectorbornedisease-none';
  if (t === 'yes') plan = 'vectorbornedisease-protocol';
  return { plan, t };
}
function FungalInfectionWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fungalinfectionworkup-none';
  if (t === 'yes') plan = 'fungalinfectionworkup-protocol';
  return { plan, t };
}
function MycobacterialDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mycobacterialdisease-none';
  if (t === 'yes') plan = 'mycobacterialdisease-protocol';
  return { plan, t };
}
function ViralHepatitisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'viralhepatitisadvanced-none';
  if (t === 'yes') plan = 'viralhepatitisadvanced-protocol';
  return { plan, t };
}
function HIVOpportunisticInfection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hivopportunisticinfection-none';
  if (t === 'yes') plan = 'hivopportunisticinfection-protocol';
  return { plan, t };
}
module.exports = {
  FeverOfUnknownOrigin, TravelRelatedInfection, ImmunocompromisedHost, HealthcareAssociatedInfection, ZoonoticDisease, VectorBorneDisease, FungalInfectionWorkup, MycobacterialDisease, ViralHepatitisAdvanced, HIVOpportunisticInfection
};
