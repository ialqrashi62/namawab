// P3-EB pcc_oncology_radiation_engine v3.92.0
'use strict';
function RadiationTreatmentPlanning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiationTreatmentPlanning-none';
  if (t === 'yes') plan = 'radiationTreatmentPlanning-protocol';
  return { plan, t };
}
function IMRTvsVMATSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'iMRTvsVMATSelection-none';
  if (t === 'yes') plan = 'iMRTvsVMATSelection-protocol';
  return { plan, t };
}
function StereotacticRadiosurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'stereotacticRadiosurgery-none';
  if (t === 'yes') plan = 'stereotacticRadiosurgery-protocol';
  return { plan, t };
}
function BrachytherapyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'brachytherapyIndication-none';
  if (t === 'yes') plan = 'brachytherapyIndication-protocol';
  return { plan, t };
}
function ProtonTherapyEligibility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'protonTherapyEligibility-none';
  if (t === 'yes') plan = 'protonTherapyEligibility-protocol';
  return { plan, t };
}
function RadiationToxicityGrading(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiationToxicityGrading-none';
  if (t === 'yes') plan = 'radiationToxicityGrading-protocol';
  return { plan, t };
}
function ConcurrentChemoradiation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'concurrentChemoradiation-none';
  if (t === 'yes') plan = 'concurrentChemoradiation-protocol';
  return { plan, t };
}
function PalliativeRadiation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'palliativeRadiation-none';
  if (t === 'yes') plan = 'palliativeRadiation-protocol';
  return { plan, t };
}
function ReIrradiationProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'reIrradiationProtocol-none';
  if (t === 'yes') plan = 'reIrradiationProtocol-protocol';
  return { plan, t };
}
function RadiationPneumonitisRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'radiationPneumonitisRisk-none';
  if (t === 'yes') plan = 'radiationPneumonitisRisk-protocol';
  return { plan, t };
}
module.exports = { RadiationTreatmentPlanning, IMRTvsVMATSelection, StereotacticRadiosurgery, BrachytherapyIndication, ProtonTherapyEligibility, RadiationToxicityGrading, ConcurrentChemoradiation, PalliativeRadiation, ReIrradiationProtocol, RadiationPneumonitisRisk };
