// P3_DV pcc_oncology_precision_engine v3.86.0
'use strict';
function TumorGenomicProfile(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tumorGenomicProfile-none';
  if (t === 'yes') plan = 'tumorGenomicProfile-protocol';
  return { plan, t };
}
function TargetedTherapySelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'targetedTherapySelection-none';
  if (t === 'yes') plan = 'targetedTherapySelection-protocol';
  return { plan, t };
}
function ImmunotherapyEligibility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunotherapyEligibility-none';
  if (t === 'yes') plan = 'immunotherapyEligibility-protocol';
  return { plan, t };
}
function LiquidBiopsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'liquidBiopsy-none';
  if (t === 'yes') plan = 'liquidBiopsy-protocol';
  return { plan, t };
}
function MolecularTumorBoard(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'molecularTumorBoard-none';
  if (t === 'yes') plan = 'molecularTumorBoard-protocol';
  return { plan, t };
}
function PARPInhibitorEligibility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pARPInhibitorEligibility-none';
  if (t === 'yes') plan = 'pARPInhibitorEligibility-protocol';
  return { plan, t };
}
function BRCAtestingProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bRCAtestingProtocol-none';
  if (t === 'yes') plan = 'bRCAtestingProtocol-protocol';
  return { plan, t };
}
function NTRKFusionDetection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nTRKFusionDetection-none';
  if (t === 'yes') plan = 'nTRKFusionDetection-protocol';
  return { plan, t };
}
function CirculatingTumorDNA(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'circulatingTumorDNA-none';
  if (t === 'yes') plan = 'circulatingTumorDNA-protocol';
  return { plan, t };
}
function PrecisionRadiationDosimetry(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'precisionRadiationDosimetry-none';
  if (t === 'yes') plan = 'precisionRadiationDosimetry-protocol';
  return { plan, t };
}
module.exports = { TumorGenomicProfile, TargetedTherapySelection, ImmunotherapyEligibility, LiquidBiopsy, MolecularTumorBoard, PARPInhibitorEligibility, BRCAtestingProtocol, NTRKFusionDetection, CirculatingTumorDNA, PrecisionRadiationDosimetry };
