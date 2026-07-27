// P3-EG pcc_neurotology_engine v3.97.0
'use strict';
function VertigoLocalization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vertigoLocalization-none';
  if (t === 'yes') plan = 'vertigoLocalization-protocol';
  return { plan, t };
}
function AcousticNeuromaScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acousticNeuromaScreening-none';
  if (t === 'yes') plan = 'acousticNeuromaScreening-protocol';
  return { plan, t };
}
function CerebellarStrokeSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebellarStrokeSyndromes-none';
  if (t === 'yes') plan = 'cerebellarStrokeSyndromes-protocol';
  return { plan, t };
}
function BrainstemStrokeSyndromes(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'brainstemStrokeSyndromes-none';
  if (t === 'yes') plan = 'brainstemStrokeSyndromes-protocol';
  return { plan, t };
}
function PosteriorFossaTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'posteriorFossaTumor-none';
  if (t === 'yes') plan = 'posteriorFossaTumor-protocol';
  return { plan, t };
}
function HerpesZosterOticus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'herpesZosterOticus-none';
  if (t === 'yes') plan = 'herpesZosterOticus-protocol';
  return { plan, t };
}
function VestibularNeuritis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vestibularNeuritis-none';
  if (t === 'yes') plan = 'vestibularNeuritis-protocol';
  return { plan, t };
}
function Labyrinthitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'labyrinthitis-none';
  if (t === 'yes') plan = 'labyrinthitis-protocol';
  return { plan, t };
}
function OtotoxicMonitoringExtended(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ototoxicMonitoringExtended-none';
  if (t === 'yes') plan = 'ototoxicMonitoringExtended-protocol';
  return { plan, t };
}
function TinnitusHabituationTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tinnitusHabituationTherapy-none';
  if (t === 'yes') plan = 'tinnitusHabituationTherapy-protocol';
  return { plan, t };
}
module.exports = { VertigoLocalization, AcousticNeuromaScreening, CerebellarStrokeSyndromes, BrainstemStrokeSyndromes, PosteriorFossaTumor, HerpesZosterOticus, VestibularNeuritis, Labyrinthitis, OtotoxicMonitoringExtended, TinnitusHabituationTherapy };
