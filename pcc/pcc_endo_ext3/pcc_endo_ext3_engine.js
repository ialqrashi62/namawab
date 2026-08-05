// P3_CM pcc_endo_ext3_engine v3.51.0
'use strict';
function DmType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-DM';
  if (t === 'T1DM') plan = 'T1DM-insulin';
  else if (t === 'T2DM') plan = 'T2DM-management';
  return { plan, t };
}
function A1c(input) {
  const i = input || {};
  const v = Number(i.v ?? 7);
  let plan = 'A1c-controlled';
  if (v >= 10) plan = 'A1c-very-poor';
  else if (v >= 8) plan = 'A1c-elevated';
  return { plan, v };
}
function Thyroid(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-thyroid';
  if (t === 'hypothyroid') plan = 'hypothyroid-levothyroxine';
  else if (t === 'hyperthyroid') plan = 'hyperthyroid-methimazole';
  return { plan, t };
}
function Calcium(input) {
  const i = input || {};
  const v = Number(i.v ?? 9.5);
  let plan = 'normal-calcium';
  if (v >= 12) plan = 'severe-hypercalcemia';
  else if (v >= 11) plan = 'mild-hypercalcemia';
  else if (v <= 8) plan = 'hypocalcemia';
  return { plan, v };
}
function Adrenal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-adrenal';
  if (t === 'cushings') plan = 'cushings-workup';
  else if (t === 'addisons') plan = 'addisons-workup';
  return { plan, t };
}
function Pituitary(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-pituitary';
  if (t === 'prolactinoma') plan = 'prolactinoma';
  return { plan, t };
}
function Osteo(input) {
  const i = input || {};
  const t = Number(i.t ?? 0);
  let plan = 'normal-BMD';
  if (t <= -2.5) plan = 'osteoporosis';
  else if (t <= -1) plan = 'osteopenia';
  return { plan, t };
}
function Pcos(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-PCOS';
  if (t === 'confirmed') plan = 'PCOS-management';
  return { plan, t };
}
function Dka(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-DKA';
  if (t === 'mild') plan = 'mild-DKA-protocol';
  else if (t === 'severe') plan = 'severe-DKA-ICU';
  return { plan, t };
}
function Lipid(input) {
  const i = input || {};
  const ldl = Number(i.ldl ?? 100);
  let plan = 'normal-LDL';
  if (ldl >= 190) plan = 'severe-hypercholesterolemia';
  else if (ldl >= 160) plan = 'high-LDL';
  return { plan, ldl };
}
module.exports = {
  DmType, A1c, Thyroid, Calcium, Adrenal, Pituitary, Osteo, Pcos, Dka, Lipid
};
