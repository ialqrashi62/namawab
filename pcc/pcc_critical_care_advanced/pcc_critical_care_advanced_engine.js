// P3_DL pcc_critical_care_advanced_engine v3.76.0
'use strict';
function ShockIndex(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'shockindex-none';
  if (t === 'yes') plan = 'shockindex-protocol';
  return { plan, t };
}
function LactateClearance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lactateclearance-none';
  if (t === 'yes') plan = 'lactateclearance-protocol';
  return { plan, t };
}
function Scvo2Monitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'scvo2monitoring-none';
  if (t === 'yes') plan = 'scvo2monitoring-protocol';
  return { plan, t };
}
function Microcirculation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microcirculation-none';
  if (t === 'yes') plan = 'microcirculation-protocol';
  return { plan, t };
}
function CuffPressure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cuffpressure-none';
  if (t === 'yes') plan = 'cuffpressure-protocol';
  return { plan, t };
}
function PronePositioning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pronepositioning-none';
  if (t === 'yes') plan = 'pronepositioning-protocol';
  return { plan, t };
}
function ECMOIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ecmoindication-none';
  if (t === 'yes') plan = 'ecmoindication-protocol';
  return { plan, t };
}
function CRRTDosing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'crrtdosing-none';
  if (t === 'yes') plan = 'crrtdosing-protocol';
  return { plan, t };
}
function NeuromuscularBlock(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuromuscularblock-none';
  if (t === 'yes') plan = 'neuromuscularblock-protocol';
  return { plan, t };
}
function DeliriumPrevention(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'deliriumprevention-none';
  if (t === 'yes') plan = 'deliriumprevention-protocol';
  return { plan, t };
}
module.exports = {
  ShockIndex, LactateClearance, Scvo2Monitoring, Microcirculation, CuffPressure, PronePositioning, ECMOIndication, CRRTDosing, NeuromuscularBlock, DeliriumPrevention
};
