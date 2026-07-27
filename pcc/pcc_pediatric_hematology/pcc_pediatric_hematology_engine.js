// P3-EF pcc_pediatric_hematology_engine v3.96.0
'use strict';
function ChildhoodAnemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'childhoodAnemiaWorkup-none';
  if (t === 'yes') plan = 'childhoodAnemiaWorkup-protocol';
  return { plan, t };
}
function SickleCellDiseaseManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sickleCellDiseaseManagement-none';
  if (t === 'yes') plan = 'sickleCellDiseaseManagement-protocol';
  return { plan, t };
}
function ThalassemiaSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thalassemiaSyndromes-none';
  if (t === 'yes') plan = 'thalassemiaSyndromes-protocol';
  return { plan, t };
}
function PediatricThrombocytopenia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricThrombocytopenia-none';
  if (t === 'yes') plan = 'pediatricThrombocytopenia-protocol';
  return { plan, t };
}
function HemophiliaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hemophiliaManagement-none';
  if (t === 'yes') plan = 'hemophiliaManagement-protocol';
  return { plan, t };
}
function VonWillebrandDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vonWillebrandDisease-none';
  if (t === 'yes') plan = 'vonWillebrandDisease-protocol';
  return { plan, t };
}
function PediatricLeukemiaSupport(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLeukemiaSupport-none';
  if (t === 'yes') plan = 'pediatricLeukemiaSupport-protocol';
  return { plan, t };
}
function BoneMarrowFailureSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'boneMarrowFailureSyndromes-none';
  if (t === 'yes') plan = 'boneMarrowFailureSyndromes-protocol';
  return { plan, t };
}
function IronDeficiencyAnemia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ironDeficiencyAnemia-none';
  if (t === 'yes') plan = 'ironDeficiencyAnemia-protocol';
  return { plan, t };
}
function NewbornHematologicScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'newbornHematologicScreening-none';
  if (t === 'yes') plan = 'newbornHematologicScreening-protocol';
  return { plan, t };
}
module.exports = { ChildhoodAnemiaWorkup, SickleCellDiseaseManagement, ThalassemiaSyndromes, PediatricThrombocytopenia, HemophiliaManagement, VonWillebrandDisease, PediatricLeukemiaSupport, BoneMarrowFailureSyndromes, IronDeficiencyAnemia, NewbornHematologicScreening };
