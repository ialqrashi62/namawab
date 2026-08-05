// P3_DV pcc_transplant_ext2_engine v3.86.0
'use strict';
function ABOCompatibilityExtended(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aBOCompatibilityExtended-none';
  if (t === 'yes') plan = 'aBOCompatibilityExtended-protocol';
  return { plan, t };
}
function HLAtypingExtended(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hLAtypingExtended-none';
  if (t === 'yes') plan = 'hLAtypingExtended-protocol';
  return { plan, t };
}
function CrossmatchVirtual(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'crossmatchVirtual-none';
  if (t === 'yes') plan = 'crossmatchVirtual-protocol';
  return { plan, t };
}
function ImmunosuppressionProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunosuppressionProtocol-none';
  if (t === 'yes') plan = 'immunosuppressionProtocol-protocol';
  return { plan, t };
}
function RejectionSurveillance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rejectionSurveillance-none';
  if (t === 'yes') plan = 'rejectionSurveillance-protocol';
  return { plan, t };
}
function DonorRecipientMatching(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'donorRecipientMatching-none';
  if (t === 'yes') plan = 'donorRecipientMatching-protocol';
  return { plan, t };
}
function PostTransplantInfection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postTransplantInfection-none';
  if (t === 'yes') plan = 'postTransplantInfection-protocol';
  return { plan, t };
}
function GVHDProphylaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gVHDProphylaxis-none';
  if (t === 'yes') plan = 'gVHDProphylaxis-protocol';
  return { plan, t };
}
function TransplantPharmacogenomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transplantPharmacogenomics-none';
  if (t === 'yes') plan = 'transplantPharmacogenomics-protocol';
  return { plan, t };
}
function LongTermGraftSurvival(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'longTermGraftSurvival-none';
  if (t === 'yes') plan = 'longTermGraftSurvival-protocol';
  return { plan, t };
}
module.exports = { ABOCompatibilityExtended, HLAtypingExtended, CrossmatchVirtual, ImmunosuppressionProtocol, RejectionSurveillance, DonorRecipientMatching, PostTransplantInfection, GVHDProphylaxis, TransplantPharmacogenomics, LongTermGraftSurvival };
