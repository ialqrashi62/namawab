// P3-CQ pcc_diet_nutr_engine v3.55.0
'use strict';
function Bmi(input) {
  const i = input || {};
  const v = Number(i.v ?? 22);
  let plan = 'normal-BMI';
  if (v >= 40) plan = 'class-III-obese';
  else if (v >= 30) plan = 'obese';
  else if (v >= 25) plan = 'overweight';
  else if (v < 18.5) plan = 'underweight';
  return { plan, v };
}
function Tpn(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-TPN';
  if (t === 'initiating') plan = 'TPN-initiating';
  return { plan, t };
}
function Diet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'regular-diet';
  if (t === 'cardiac') plan = 'cardiac-diet';
  else if (t === 'renal') plan = 'renal-diet';
  else if (t === 'diabetic') plan = 'diabetic-diet';
  return { plan, t };
}
function Tube(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tube';
  if (t === 'NG') plan = 'NG-feeding';
  return { plan, t };
}
function Supplement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-supplement';
  if (t === 'PO') plan = 'PO-supplement';
  return { plan, t };
}
function Malnutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-malnutrition';
  if (t === 'severe') plan = 'severe-malnutrition';
  return { plan, t };
}
function Intolerance(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-intolerance';
  if (t === 'lactose') plan = 'lactose-intolerance';
  return { plan, t };
}
function Aspiration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-aspiration';
  if (t === 'high-risk') plan = 'aspiration-risk';
  return { plan, t };
}
function Refeeding(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-refeeding';
  if (t === 'high-risk') plan = 'refeeding-syndrome-risk';
  return { plan, t };
}
function Allerg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-allergy';
  if (t === 'milk') plan = 'milk-allergy';
  return { plan, t };
}
module.exports = {
  Bmi, Tpn, Diet, Tube, Supplement, Malnutrition, Intolerance, Aspiration, Refeeding, Allerg
};
