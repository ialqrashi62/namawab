// P3_EC pcc_hand_surgery_engine v3.93.0
'use strict';
function CarpalTunnelRelease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'carpalTunnelRelease-none';
  if (t === 'yes') plan = 'carpalTunnelRelease-protocol';
  return { plan, t };
}
function TriggerFingerRelease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'triggerFingerRelease-none';
  if (t === 'yes') plan = 'triggerFingerRelease-protocol';
  return { plan, t };
}
function DupuytrenContracture(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dupuytrenContracture-none';
  if (t === 'yes') plan = 'dupuytrenContracture-protocol';
  return { plan, t };
}
function DeQuervainRelease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'deQuervainRelease-none';
  if (t === 'yes') plan = 'deQuervainRelease-protocol';
  return { plan, t };
}
function TendonRepairZone(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tendonRepairZone-none';
  if (t === 'yes') plan = 'tendonRepairZone-protocol';
  return { plan, t };
}
function NerveRepairIndications(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nerveRepairIndications-none';
  if (t === 'yes') plan = 'nerveRepairIndications-protocol';
  return { plan, t };
}
function FractureReductionHand(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fractureReductionHand-none';
  if (t === 'yes') plan = 'fractureReductionHand-protocol';
  return { plan, t };
}
function ReplantationDecision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'replantationDecision-none';
  if (t === 'yes') plan = 'replantationDecision-protocol';
  return { plan, t };
}
function CongenitalHandDifference(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalHandDifference-none';
  if (t === 'yes') plan = 'congenitalHandDifference-protocol';
  return { plan, t };
}
function WristArthroscopyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wristArthroscopyIndication-none';
  if (t === 'yes') plan = 'wristArthroscopyIndication-protocol';
  return { plan, t };
}
module.exports = { CarpalTunnelRelease, TriggerFingerRelease, DupuytrenContracture, DeQuervainRelease, TendonRepairZone, NerveRepairIndications, FractureReductionHand, ReplantationDecision, CongenitalHandDifference, WristArthroscopyIndication };
