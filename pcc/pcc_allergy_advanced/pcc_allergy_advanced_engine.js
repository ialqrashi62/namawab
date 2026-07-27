// P3-DP pcc_allergy_advanced_engine v3.80.0
'use strict';
function AnaphylaxisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'anaphylaxisadvanced-none';
  if (t === 'yes') plan = 'anaphylaxisadvanced-protocol';
  return { plan, t };
}
function DrugAllergyDelabeling(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'drugallergydelabeling-none';
  if (t === 'yes') plan = 'drugallergydelabeling-protocol';
  return { plan, t };
}
function FoodAllergyOralImmunotherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'foodallergyoralimmunotherapy-none';
  if (t === 'yes') plan = 'foodallergyoralimmunotherapy-protocol';
  return { plan, t };
}
function VenomImmunotherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'venomimmunotherapy-none';
  if (t === 'yes') plan = 'venomimmunotherapy-protocol';
  return { plan, t };
}
function AllergicBronchopulmonaryAspergillosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergicbronchopulmonaryaspergillosis-none';
  if (t === 'yes') plan = 'allergicbronchopulmonaryaspergillosis-protocol';
  return { plan, t };
}
function EosinophilicGranulomatosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eosinophilicgranulomatosis-none';
  if (t === 'yes') plan = 'eosinophilicgranulomatosis-protocol';
  return { plan, t };
}
function MastCellActivation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mastcellactivation-none';
  if (t === 'yes') plan = 'mastcellactivation-protocol';
  return { plan, t };
}
function ChronicUrticariaRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chronicurticariarefractory-none';
  if (t === 'yes') plan = 'chronicurticariarefractory-protocol';
  return { plan, t };
}
function AllergicRhinoconjunctivitisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergicrhinoconjunctivitisadvanced-none';
  if (t === 'yes') plan = 'allergicrhinoconjunctivitisadvanced-protocol';
  return { plan, t };
}
function ContactDermatitisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'contactdermatitisadvanced-none';
  if (t === 'yes') plan = 'contactdermatitisadvanced-protocol';
  return { plan, t };
}
module.exports = {
  AnaphylaxisAdvanced, DrugAllergyDelabeling, FoodAllergyOralImmunotherapy, VenomImmunotherapy, AllergicBronchopulmonaryAspergillosis, EosinophilicGranulomatosis, MastCellActivation, ChronicUrticariaRefractory, AllergicRhinoconjunctivitisAdvanced, ContactDermatitisAdvanced
};
