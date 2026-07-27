// P3-EK pcc_ortho_ext_engine v3.101.0
'use strict';
function JointReplacementEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'jointReplacementEval-none';
  if (t === 'yes') plan = 'jointReplacementEval-protocol';
  return { plan, t };
}
function HipFracturePathway(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hipFracturePathway-none';
  if (t === 'yes') plan = 'hipFracturePathway-protocol';
  return { plan, t };
}
function KneeArthroscopyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'kneeArthroscopyIndication-none';
  if (t === 'yes') plan = 'kneeArthroscopyIndication-protocol';
  return { plan, t };
}
function ShoulderReplacement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'shoulderReplacement-none';
  if (t === 'yes') plan = 'shoulderReplacement-protocol';
  return { plan, t };
}
function SpinalDecompression(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalDecompression-none';
  if (t === 'yes') plan = 'spinalDecompression-protocol';
  return { plan, t };
}
function OrthopedicTraumaTriage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'orthopedicTraumaTriage-none';
  if (t === 'yes') plan = 'orthopedicTraumaTriage-protocol';
  return { plan, t };
}
function PediatricFractureEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFractureEval-none';
  if (t === 'yes') plan = 'pediatricFractureEval-protocol';
  return { plan, t };
}
function OsteomyelitisWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'osteomyelitisWorkup-none';
  if (t === 'yes') plan = 'osteomyelitisWorkup-protocol';
  return { plan, t };
}
function BoneTumorWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'boneTumorWorkup-none';
  if (t === 'yes') plan = 'boneTumorWorkup-protocol';
  return { plan, t };
}
function CompartmentSyndromeCheck(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'compartmentSyndromeCheck-none';
  if (t === 'yes') plan = 'compartmentSyndromeCheck-protocol';
  return { plan, t };
}
module.exports = { JointReplacementEval, HipFracturePathway, KneeArthroscopyIndication, ShoulderReplacement, SpinalDecompression, OrthopedicTraumaTriage, PediatricFractureEval, OsteomyelitisWorkup, BoneTumorWorkup, CompartmentSyndromeCheck };
