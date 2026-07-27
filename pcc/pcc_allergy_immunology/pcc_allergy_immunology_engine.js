// P3-CW pcc_allergy_immunology_engine v3.61.0
'use strict';
function Ige(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ige-none';
  if (t === 'yes') plan = 'ige-protocol';
  return { plan, t };
}
function SkinTest(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'skintest-none';
  if (t === 'yes') plan = 'skintest-protocol';
  return { plan, t };
}
function Anaphylaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'anaphylaxis-none';
  if (t === 'yes') plan = 'anaphylaxis-protocol';
  return { plan, t };
}
function Desensitization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'desensitization-none';
  if (t === 'yes') plan = 'desensitization-protocol';
  return { plan, t };
}
function FoodAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'foodallergy-none';
  if (t === 'yes') plan = 'foodallergy-protocol';
  return { plan, t };
}
function DrugAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'drugallergy-none';
  if (t === 'yes') plan = 'drugallergy-protocol';
  return { plan, t };
}
function InsectAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'insectallergy-none';
  if (t === 'yes') plan = 'insectallergy-protocol';
  return { plan, t };
}
function AsthmaAllergy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'asthmaallergy-none';
  if (t === 'yes') plan = 'asthmaallergy-protocol';
  return { plan, t };
}
function Immunodeficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunodeficiency-none';
  if (t === 'yes') plan = 'immunodeficiency-protocol';
  return { plan, t };
}
function Biologic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biologic-none';
  if (t === 'yes') plan = 'biologic-protocol';
  return { plan, t };
}
module.exports = {
  Ige, SkinTest, Anaphylaxis, Desensitization, FoodAllergy, DrugAllergy, InsectAllergy, AsthmaAllergy, Immunodeficiency, Biologic
};
