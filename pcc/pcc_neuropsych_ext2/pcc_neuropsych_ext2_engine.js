// P3-EI pcc_neuropsych_ext2_engine v3.99.0
'use strict';
function NeurocognitiveDisorderMajor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurocognitiveDisorderMajor-none';
  if (t === 'yes') plan = 'neurocognitiveDisorderMajor-protocol';
  return { plan, t };
}
function FrontotemporalDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'frontotemporalDementia-none';
  if (t === 'yes') plan = 'frontotemporalDementia-protocol';
  return { plan, t };
}
function LewyBodyDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lewyBodyDementia-none';
  if (t === 'yes') plan = 'lewyBodyDementia-protocol';
  return { plan, t };
}
function VascularDementia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularDementia-none';
  if (t === 'yes') plan = 'vascularDementia-protocol';
  return { plan, t };
}
function MildCognitiveImpairment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mildCognitiveImpairment-none';
  if (t === 'yes') plan = 'mildCognitiveImpairment-protocol';
  return { plan, t };
}
function WernickeKorsakoff(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wernickeKorsakoff-none';
  if (t === 'yes') plan = 'wernickeKorsakoff-protocol';
  return { plan, t };
}
function TraumaticBrainInjuryCognitive(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'traumaticBrainInjuryCognitive-none';
  if (t === 'yes') plan = 'traumaticBrainInjuryCognitive-protocol';
  return { plan, t };
}
function PostConcussionSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postConcussionSyndrome-none';
  if (t === 'yes') plan = 'postConcussionSyndrome-protocol';
  return { plan, t };
}
function ChemotherapyRelatedCognitive(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chemotherapyRelatedCognitive-none';
  if (t === 'yes') plan = 'chemotherapyRelatedCognitive-protocol';
  return { plan, t };
}
function AutoimmuneEncephalitisCognitive(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmuneEncephalitisCognitive-none';
  if (t === 'yes') plan = 'autoimmuneEncephalitisCognitive-protocol';
  return { plan, t };
}
module.exports = { NeurocognitiveDisorderMajor, FrontotemporalDementia, LewyBodyDementia, VascularDementia, MildCognitiveImpairment, WernickeKorsakoff, TraumaticBrainInjuryCognitive, PostConcussionSyndrome, ChemotherapyRelatedCognitive, AutoimmuneEncephalitisCognitive };
