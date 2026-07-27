// P3-DF pcc_allergy_precision_engine v3.70.0
'use strict';
function AllergenComponent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergencomponent-none';
  if (t === 'yes') plan = 'allergencomponent-protocol';
  return { plan, t };
}
function CrossReactivity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'crossreactivity-none';
  if (t === 'yes') plan = 'crossreactivity-protocol';
  return { plan, t };
}
function OralAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oralallergy-none';
  if (t === 'yes') plan = 'oralallergy-protocol';
  return { plan, t };
}
function DrugAllergyGenetics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'drugallergygenetics-none';
  if (t === 'yes') plan = 'drugallergygenetics-protocol';
  return { plan, t };
}
function VenomAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'venomallergy-none';
  if (t === 'yes') plan = 'venomallergy-protocol';
  return { plan, t };
}
function AtopicDermatitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'atopicdermatitis-none';
  if (t === 'yes') plan = 'atopicdermatitis-protocol';
  return { plan, t };
}
function AllergicRhinitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'allergicrhinitis-none';
  if (t === 'yes') plan = 'allergicrhinitis-protocol';
  return { plan, t };
}
function AsthmaAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'asthmaallergy-none';
  if (t === 'yes') plan = 'asthmaallergy-protocol';
  return { plan, t };
}
function FoodChallenge(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'foodchallenge-none';
  if (t === 'yes') plan = 'foodchallenge-protocol';
  return { plan, t };
}
function Desensitization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'desensitization-none';
  if (t === 'yes') plan = 'desensitization-protocol';
  return { plan, t };
}
module.exports = {
  AllergenComponent, CrossReactivity, OralAllergy, DrugAllergyGenetics, VenomAllergy, AtopicDermatitis, AllergicRhinitis, AsthmaAllergy, FoodChallenge, Desensitization
};
