// P3-DN pcc_nephrology_advanced_engine v3.78.0
'use strict';
function ProteinuriaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'proteinuriaworkup-none';
  if (t === 'yes') plan = 'proteinuriaworkup-protocol';
  return { plan, t };
}
function HematuriaEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hematuriaevaluation-none';
  if (t === 'yes') plan = 'hematuriaevaluation-protocol';
  return { plan, t };
}
function NephroticSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nephroticsyndrome-none';
  if (t === 'yes') plan = 'nephroticsyndrome-protocol';
  return { plan, t };
}
function NephriticSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nephriticsyndrome-none';
  if (t === 'yes') plan = 'nephriticsyndrome-protocol';
  return { plan, t };
}
function RapidlyProgressiveGN(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rapidlyprogressivegn-none';
  if (t === 'yes') plan = 'rapidlyprogressivegn-protocol';
  return { plan, t };
}
function DiabeticNephropathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diabeticnephropathy-none';
  if (t === 'yes') plan = 'diabeticnephropathy-protocol';
  return { plan, t };
}
function HypertensiveNephrosclerosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypertensivenephrosclerosis-none';
  if (t === 'yes') plan = 'hypertensivenephrosclerosis-protocol';
  return { plan, t };
}
function PolycysticKidneyDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polycystickidneydisease-none';
  if (t === 'yes') plan = 'polycystickidneydisease-protocol';
  return { plan, t };
}
function RenalArteryStenosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'renalarterystenosis-none';
  if (t === 'yes') plan = 'renalarterystenosis-protocol';
  return { plan, t };
}
function ChronicKidneyDiseaseProgression(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chronickidneydiseaseprogression-none';
  if (t === 'yes') plan = 'chronickidneydiseaseprogression-protocol';
  return { plan, t };
}
module.exports = {
  ProteinuriaWorkup, HematuriaEvaluation, NephroticSyndrome, NephriticSyndrome, RapidlyProgressiveGN, DiabeticNephropathy, HypertensiveNephrosclerosis, PolycysticKidneyDisease, RenalArteryStenosis, ChronicKidneyDiseaseProgression
};
