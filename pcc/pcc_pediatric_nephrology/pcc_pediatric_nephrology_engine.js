// P3-EF pcc_pediatric_nephrology_engine v3.96.0
'use strict';
function NephroticSyndromeChild(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nephroticSyndromeChild-none';
  if (t === 'yes') plan = 'nephroticSyndromeChild-protocol';
  return { plan, t };
}
function PediatricUTIWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUTIWorkup-none';
  if (t === 'yes') plan = 'pediatricUTIWorkup-protocol';
  return { plan, t };
}
function HemolyticUremicSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hemolyticUremicSyndrome-none';
  if (t === 'yes') plan = 'hemolyticUremicSyndrome-protocol';
  return { plan, t };
}
function ChronicKidneyDiseasePediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chronicKidneyDiseasePediatric-none';
  if (t === 'yes') plan = 'chronicKidneyDiseasePediatric-protocol';
  return { plan, t };
}
function RenalTubularAcidosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'renalTubularAcidosis-none';
  if (t === 'yes') plan = 'renalTubularAcidosis-protocol';
  return { plan, t };
}
function PolycysticKidneyDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polycysticKidneyDisease-none';
  if (t === 'yes') plan = 'polycysticKidneyDisease-protocol';
  return { plan, t };
}
function GlomerulonephritisPediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'glomerulonephritisPediatric-none';
  if (t === 'yes') plan = 'glomerulonephritisPediatric-protocol';
  return { plan, t };
}
function HypertensionPediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypertensionPediatric-none';
  if (t === 'yes') plan = 'hypertensionPediatric-protocol';
  return { plan, t };
}
function DialysisPediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisPediatric-none';
  if (t === 'yes') plan = 'dialysisPediatric-protocol';
  return { plan, t };
}
function RenalTransplantPediatric(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'renalTransplantPediatric-none';
  if (t === 'yes') plan = 'renalTransplantPediatric-protocol';
  return { plan, t };
}
module.exports = { NephroticSyndromeChild, PediatricUTIWorkup, HemolyticUremicSyndrome, ChronicKidneyDiseasePediatric, RenalTubularAcidosis, PolycysticKidneyDisease, GlomerulonephritisPediatric, HypertensionPediatric, DialysisPediatric, RenalTransplantPediatric };
