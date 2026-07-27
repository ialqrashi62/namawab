// P3-EJ pcc_spine_surgery_ext_engine v3.100.0
'use strict';
function SpinalStenosisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalStenosisEval-none';
  if (t === 'yes') plan = 'spinalStenosisEval-protocol';
  return { plan, t };
}
function DiscHerniationProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'discHerniationProtocol-none';
  if (t === 'yes') plan = 'discHerniationProtocol-protocol';
  return { plan, t };
}
function SpinalFusionIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalFusionIndication-none';
  if (t === 'yes') plan = 'spinalFusionIndication-protocol';
  return { plan, t };
}
function ScoliosisSurgicalPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'scoliosisSurgicalPlan-none';
  if (t === 'yes') plan = 'scoliosisSurgicalPlan-protocol';
  return { plan, t };
}
function SpinalCordTriage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalCordTriage-none';
  if (t === 'yes') plan = 'spinalCordTriage-protocol';
  return { plan, t };
}
function VertebralFracture(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vertebralFracture-none';
  if (t === 'yes') plan = 'vertebralFracture-protocol';
  return { plan, t };
}
function CaudaEquinaSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'caudaEquinaSyndrome-none';
  if (t === 'yes') plan = 'caudaEquinaSyndrome-protocol';
  return { plan, t };
}
function SpinalTumorWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalTumorWorkup-none';
  if (t === 'yes') plan = 'spinalTumorWorkup-protocol';
  return { plan, t };
}
function CervicalMyelopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cervicalMyelopathy-none';
  if (t === 'yes') plan = 'cervicalMyelopathy-protocol';
  return { plan, t };
}
function SpondylolisthesisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spondylolisthesisEval-none';
  if (t === 'yes') plan = 'spondylolisthesisEval-protocol';
  return { plan, t };
}
module.exports = { SpinalStenosisEval, DiscHerniationProtocol, SpinalFusionIndication, ScoliosisSurgicalPlan, SpinalCordTriage, VertebralFracture, CaudaEquinaSyndrome, SpinalTumorWorkup, CervicalMyelopathy, SpondylolisthesisEval };
